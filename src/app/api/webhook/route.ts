import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  // Set this in your Stripe dashboard → Developers → Webhooks → signing secret
  // and add it as STRIPE_WEBHOOK_SECRET in your environment.
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      // Verify webhook signature when secret is configured
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      // Allow unsigned events in development (no webhook secret set)
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      // Order confirmation email would be sent here.
      // Example with your email provider:
      //   await sendOrderConfirmationEmail({
      //     to: session.customer_email,
      //     name: session.metadata?.firstName,
      //     orderNumber: session.id,
      //     amount: session.amount_total,
      //   });

      console.log("Order completed:", {
        sessionId: session.id,
        customer: session.customer_email,
        amount: session.amount_total,
        currency: session.currency,
        name: `${session.metadata?.firstName ?? ""} ${session.metadata?.lastName ?? ""}`.trim(),
        shippingMethod: session.metadata?.shippingMethod,
        itemCount: session.metadata?.itemCount,
      });
      break;
    }

    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("Checkout session expired:", session.id);
      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      console.error("Payment failed:", intent.id, intent.last_payment_error?.message);
      break;
    }

    default:
      // Unhandled event type — safe to ignore
      break;
  }

  return NextResponse.json({ received: true });
}
