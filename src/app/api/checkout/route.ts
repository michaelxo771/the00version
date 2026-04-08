import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { CartItem } from "@/context/CartContext";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

type CheckoutBody = {
  items: CartItem[];
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  shippingMethod: string;
};

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const body: CheckoutBody = await req.json();
    const { items, customerInfo, shippingMethod } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Shipping cost in cents
    const shippingCosts: Record<string, number> = {
      standard: subtotal >= 150 ? 0 : 1200,
      express: 2400,
      overnight: 4000,
    };
    const shippingCostCents = shippingCosts[shippingMethod] ?? 1200;

    const shippingLabels: Record<string, string> = {
      standard: subtotal >= 150 ? "Free Standard Shipping (5–7 days)" : "Standard Shipping (5–7 days)",
      express: "Express Shipping (2–3 days)",
      overnight: "Overnight Shipping (next day)",
    };

    // Build line items
    const lineItems = items.map(
      (item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.product.name,
            description: `${item.size} · ${item.color} — ${item.product.category}`,
            metadata: {
              productId: item.product.id,
              size: item.size,
              color: item.color,
            },
          },
          unit_amount: Math.round(item.product.price * 100), // cents
        },
        quantity: item.quantity,
      })
    );

    const origin = req.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: customerInfo.email || undefined,
      metadata: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        address: customerInfo.address,
        city: customerInfo.city,
        state: customerInfo.state,
        zip: customerInfo.zip,
        phone: customerInfo.phone,
        shippingMethod,
        itemCount: String(items.reduce((s, i) => s + i.quantity, 0)),
      },
      shipping_options: shippingCostCents > 0
        ? [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: shippingCostCents, currency: "eur" },
                display_name: shippingLabels[shippingMethod],
                delivery_estimate: {
                  minimum: { unit: "business_day", value: shippingMethod === "overnight" ? 1 : shippingMethod === "express" ? 2 : 5 },
                  maximum: { unit: "business_day", value: shippingMethod === "overnight" ? 1 : shippingMethod === "express" ? 3 : 7 },
                },
              },
            },
          ]
        : [
            {
              shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: { amount: 0, currency: "eur" },
                display_name: "Free Standard Shipping (5–7 days)",
              },
            },
          ],
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      billing_address_collection: "auto",
      phone_number_collection: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
