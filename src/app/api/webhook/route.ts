import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { buildOrderEmail } from "@/lib/orderEmail";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
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
      await handleOrderCompleted(stripe, session);
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
      break;
  }

  return NextResponse.json({ received: true });
}

async function handleOrderCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  // Retrieve session with expanded line items
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items"],
  });

  const meta = fullSession.metadata ?? {};
  const firstName = meta.firstName || "there";
  const lastName = meta.lastName || "";
  const customerEmail = fullSession.customer_email ?? fullSession.customer_details?.email;
  const orderNumber = `#00S${session.id.slice(-6).toUpperCase()}`;
  const shippingMethod = meta.shippingMethod || "standard";

  // Parse amounts (in cents from Stripe)
  const amountTotal = (fullSession.amount_total ?? 0) / 100;
  const amountSubtotal = (fullSession.amount_subtotal ?? 0) / 100;
  const discountAmount = amountSubtotal - amountTotal > 0
    ? amountSubtotal - amountTotal
    : 0;

  // Determine shipping cost from the session
  const shippingCosts: Record<string, number> = { standard: 12, express: 24, overnight: 40 };
  const shippingCost = amountSubtotal >= 150 ? 0 : (shippingCosts[shippingMethod] ?? 12);

  // Build items array from Stripe line items
  const lineItems = fullSession.line_items?.data ?? [];
  const items = lineItems.map((item) => {
    const prod = item.price?.product;
    const prodMeta =
      prod && typeof prod !== "string" && "metadata" in prod
        ? (prod as { metadata: Record<string, string> }).metadata
        : {};
    return {
      name: item.description ?? "Item",
      size: prodMeta.size ?? "",
      color: prodMeta.color ?? "",
      quantity: item.quantity ?? 1,
      unitPrice: ((item.price?.unit_amount ?? 0) / 100),
    };
  });

  console.log("Order completed:", {
    sessionId: session.id,
    orderNumber,
    customer: customerEmail,
    name: `${firstName} ${lastName}`.trim(),
    amount: amountTotal,
    shippingMethod,
    itemCount: meta.itemCount,
  });

  // Send confirmation email via Resend
  if (customerEmail) {
    const resend = getResend();
    if (resend) {
      try {
        const html = buildOrderEmail({
          firstName,
          orderNumber,
          items,
          subtotal: amountSubtotal,
          discountAmount,
          shippingCost,
          total: amountTotal,
          shippingMethod,
        });

        const { error } = await resend.emails.send({
          from: "The 00s Version <orders@the00sversion.com>",
          to: customerEmail,
          subject: `Order Confirmed ${orderNumber} — The 00s Version`,
          html,
        });

        if (error) {
          console.error("Resend email error:", error);
        } else {
          console.log("Confirmation email sent to:", customerEmail);
        }
      } catch (err) {
        // Non-fatal — log and continue
        console.error("Failed to send confirmation email:", err);
      }
    } else {
      console.log("RESEND_API_KEY not set — skipping confirmation email");
    }
  }
}
