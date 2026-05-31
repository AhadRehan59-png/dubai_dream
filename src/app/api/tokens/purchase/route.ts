import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { getPaymentMethod, type PaymentMethodId } from "@/lib/payment-methods";
const purchaseSchema = z.object({
  drawId: z.string(),
  quantity: z.number().int().min(1).max(100),
  paymentMethod: z.enum(["easypaisa", "jazzcash", "bank_card", "bank_transfer", "raast"]),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Please login to purchase tokens" }, { status: 401 });
    }

    const body = await request.json();
    const { drawId, quantity, paymentMethod } = purchaseSchema.parse(body);

    const method = getPaymentMethod(paymentMethod as PaymentMethodId);
    if (!method) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const draw = await prisma.draw.findUnique({ where: { id: drawId } });
    if (!draw || draw.status !== "ACTIVE") {
      return NextResponse.json({ error: "Draw is not available" }, { status: 400 });
    }

    const remaining = draw.totalTokens - draw.soldTokens;
    if (quantity > remaining) {
      return NextResponse.json({ error: `Only ${remaining} tokens remaining` }, { status: 400 });
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
    return NextResponse.json({
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
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    console.error("Purchase error:", error);
    return NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
  }
}
