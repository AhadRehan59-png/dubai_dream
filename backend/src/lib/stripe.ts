import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("your_stripe")) return null;
  if (!stripeInstance) {
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}

export async function createCheckoutSession(params: {
  drawId: string;
  drawTitle: string;
  tokenPrice: number;
  quantity: number;
  userId: string;
  userEmail: string;
}) {
  const stripe = getStripe();
  if (!stripe) return null;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: params.userEmail,
    line_items: [
      {
        price_data: {
          currency: "aed",
          product_data: {
            name: `Dream Dubai - ${params.drawTitle}`,
            description: `${params.quantity} raffle token(s)`,
          },
          unit_amount: Math.round(params.tokenPrice * 100),
        },
        quantity: params.quantity,
      },
    ],
    metadata: {
      drawId: params.drawId,
      userId: params.userId,
      quantity: String(params.quantity),
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tickets?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/draw/${params.drawId}?cancelled=true`,
  });

  return session;
}
