import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateTokenNumber } from "@/lib/utils";
import { sendPurchaseConfirmation } from "@/lib/notifications";

const confirmSchema = z.object({
  transactionRef: z.string().min(4),
  payerPhone: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const { id: paymentId } = await params;
    const body = await request.json();
    const { transactionRef, payerPhone } = confirmSchema.parse(body);

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { draw: true },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    if (payment.userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (payment.status === "COMPLETED") {
      return NextResponse.json({ error: "Payment already confirmed" }, { status: 400 });
    }

    if (payment.status !== "PENDING") {
      return NextResponse.json({ error: "Payment cannot be confirmed" }, { status: 400 });
    }

    const draw = payment.draw;
    const remaining = draw.totalTokens - draw.soldTokens;
    if (payment.quantity > remaining) {
      return NextResponse.json({ error: "Not enough tokens remaining" }, { status: 400 });
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

    const result = { tokenNumbers };

    await sendPurchaseConfirmation(
      user.email,
      user.firstName,
      result.tokenNumbers,
      draw.title
    );

    return NextResponse.json({
      success: true,
      tokenNumbers: result.tokenNumbers,
      message: "Payment confirmed! Your tickets have been issued.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Please enter a valid transaction reference" }, { status: 400 });
    }
    console.error("Payment confirm error:", error);
    return NextResponse.json({ error: "Payment confirmation failed" }, { status: 500 });
  }
}
