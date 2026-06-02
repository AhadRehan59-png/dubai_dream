import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getCurrentUser } from "../lib/auth";
import { getPaymentMethod, type PaymentMethodId } from "../lib/payment-methods";

const router = Router();

const purchaseSchema = z.object({
  drawId: z.string(),
  quantity: z.number().int().min(1).max(100),
  paymentMethod: z.enum(["easypaisa", "jazzcash", "bank_card", "bank_transfer", "raast"]),
});

router.post("/purchase", async (req, res) => {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return res.status(401).json({ error: "Please login to purchase tokens" });
    }

    const { drawId, quantity, paymentMethod } = purchaseSchema.parse(req.body);

    const method = getPaymentMethod(paymentMethod as PaymentMethodId);
    if (!method) {
      return res.status(400).json({ error: "Invalid payment method" });
    }

    const draw = await prisma.draw.findUnique({ where: { id: drawId } });
    if (!draw || draw.status !== "ACTIVE") {
      return res.status(400).json({ error: "Draw is not available" });
    }

    const remaining = draw.totalTokens - draw.soldTokens;
    if (quantity > remaining) {
      return res.status(400).json({ error: `Only ${remaining} tokens remaining` });
    }

    const amount = draw.tokenPrice * quantity;

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        drawId,
        amount,
        quantity,
        status: "PENDING",
        paymentMethod,
        currency: "AED",
      },
    });

    return res.json({
      success: true,
      paymentId: payment.id,
      amount,
      paymentMethod,
      message: "Complete payment to receive your tickets",
      instructions: method.instructions,
      accountNumber: method.accountNumber,
      accountTitle: method.accountTitle,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input" });
    }
    console.error("Purchase error:", error);
    return res.status(500).json({ error: "Failed to initiate payment" });
  }
});

export default router;
