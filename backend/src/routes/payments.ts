import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getCurrentUser } from "../lib/auth";
import { generateTokenNumber } from "../lib/utils";
import { sendPurchaseConfirmation } from "../lib/notifications";

const router = Router();

const confirmSchema = z.object({
  transactionRef: z.string().min(4),
  payerPhone: z.string().optional(),
});

router.post("/:id/confirm", async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: "Please login first" });
    }

    const paymentId = req.params.id;
    const { transactionRef, payerPhone } = confirmSchema.parse(req.body);

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { draw: true },
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    if (payment.userId !== user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (payment.status === "COMPLETED") {
      return res.status(400).json({ error: "Payment already confirmed" });
    }

    if (payment.status !== "PENDING") {
      return res.status(400).json({ error: "Payment cannot be confirmed" });
    }

    const draw = payment.draw;
    const remaining = draw.totalTokens - draw.soldTokens;
    if (payment.quantity > remaining) {
      return res.status(400).json({ error: "Not enough tokens remaining" });
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "COMPLETED",
        transactionRef,
        payerPhone: payerPhone || null,
      },
    });

    const tokenNumbers: string[] = [];
    for (let i = 0; i < payment.quantity; i++) {
      const sequence = draw.soldTokens + i + 1;
      const tokenNumber = generateTokenNumber(draw.campaignCode, sequence);
      await prisma.token.create({
        data: {
          tokenNumber,
          drawId: draw.id,
          userId: user.id,
          paymentId,
        },
      });
      tokenNumbers.push(tokenNumber);
    }

    const newSoldCount = draw.soldTokens + payment.quantity;
    await prisma.draw.update({
      where: { id: draw.id },
      data: {
        soldTokens: newSoldCount,
        status: newSoldCount >= draw.totalTokens ? "SOLD_OUT" : "ACTIVE",
      },
    });

    await sendPurchaseConfirmation(
      user.email,
      user.firstName,
      tokenNumbers,
      draw.title
    );

    return res.json({
      success: true,
      tokenNumbers,
      message: "Payment confirmed! Your tickets have been issued.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Please enter a valid transaction reference" });
    }
    console.error("Payment confirm error:", error);
    return res.status(500).json({ error: "Payment confirmation failed" });
  }
});

export default router;
