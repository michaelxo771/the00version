import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { buildOrderEmail } from "@/lib/orderEmail";
import { createCJOrder, CJOrderInput } from "@/lib/cj";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import cjProductMap from "@/data/cj-products.json";

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

// ─── Orders persistence ───────────────────────────────────────────────────────

type StoredOrder = {
  orderNumber: string;
  stripeSessionId: string;
  cjOrderId?: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: {
    line1: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: Array<{
    productId: string;
    name: string;
    size: string;
    color: string;
    quantity: number;
    unitPrice: number;
  }>;
  total: number;
  cjStatus?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  createdAt: string;
  updatedAt: string;
};

const ORDERS_FILE = join(process.cwd(), "src/data/orders.json");

function readOrders(): StoredOrder[] {
  try {
    return JSON.parse(readFileSync(ORDERS_FILE, "utf-8")) as StoredOrder[];
  } catch {
    return [];
  }
}

function writeOrders(orders: StoredOrder[]) {
  try {
    writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch {
    // Non-fatal on read-only filesystems (e.g. Vercel production)
    console.warn("Could not write orders.json — filesystem may be read-only");
  }
}

export function upsertOrder(order: StoredOrder) {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.stripeSessionId === order.stripeSessionId);
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], ...order, updatedAt: new Date().toISOString() };
  } else {
    orders.unshift(order);
  }
  writeOrders(orders);
}

export function updateOrderTracking(cjOrderId: string, tracking: { trackingNumber: string; trackingCarrier: string; cjStatus: string }) {
  const orders = readOrders();
  const idx = orders.findIndex((o) => o.cjOrderId === cjOrderId);
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], ...tracking, updatedAt: new Date().toISOString() };
    writeOrders(orders);
  }
}

// ─── Stripe webhook ───────────────────────────────────────────────────────────

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

// ─── Order completed handler ──────────────────────────────────────────────────

async function handleOrderCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  // Retrieve session with expanded line items AND product metadata
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items", "line_items.data.price.product"],
  });

  const meta = fullSession.metadata ?? {};
  const firstName = meta.firstName || "there";
  const lastName = meta.lastName || "";
  const customerEmail = fullSession.customer_email ?? fullSession.customer_details?.email;
  const orderNumber = `#00S${session.id.slice(-6).toUpperCase()}`;
  const shippingMethod = meta.shippingMethod || "standard";

  // Parse amounts (cents → euros)
  const amountTotal = (fullSession.amount_total ?? 0) / 100;
  const amountSubtotal = (fullSession.amount_subtotal ?? 0) / 100;
  const discountAmount = amountSubtotal - amountTotal > 0 ? amountSubtotal - amountTotal : 0;

  const shippingCosts: Record<string, number> = { standard: 12, express: 24, overnight: 40 };
  const shippingCost = amountSubtotal >= 150 ? 0 : (shippingCosts[shippingMethod] ?? 12);

  // Build items from expanded line items (product metadata now available)
  const lineItems = fullSession.line_items?.data ?? [];
  const items = lineItems.map((item, idx) => {
    const prod = item.price?.product;
    const prodMeta =
      prod && typeof prod !== "string" && "metadata" in prod
        ? (prod as { metadata: Record<string, string> }).metadata
        : {};
    return {
      productId: prodMeta.productId ?? "",
      name: item.description ?? "Item",
      size: prodMeta.size ?? "",
      color: prodMeta.color ?? "",
      quantity: item.quantity ?? 1,
      unitPrice: (item.price?.unit_amount ?? 0) / 100,
      lineItemId: `${session.id}-${idx}`,
    };
  });

  const shippingAddr = fullSession.customer_details?.address;
  const customerName = `${firstName} ${lastName}`.trim();

  console.log("Order completed:", {
    sessionId: session.id,
    orderNumber,
    customer: customerEmail,
    name: customerName,
    amount: amountTotal,
    items: items.length,
  });

  // ── Persist order ──
  upsertOrder({
    orderNumber,
    stripeSessionId: session.id,
    customerEmail: customerEmail ?? "",
    customerName,
    shippingAddress: {
      line1: shippingAddr?.line1 ?? meta.address ?? "",
      city: shippingAddr?.city ?? meta.city ?? "",
      state: shippingAddr?.state ?? meta.state ?? "",
      postal_code: shippingAddr?.postal_code ?? meta.zip ?? "",
      country: shippingAddr?.country ?? "",
    },
    items: items.map(({ lineItemId: _, ...rest }) => rest),
    total: amountTotal,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // ── Send confirmation email ──
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
        console.error("Failed to send confirmation email:", err);
      }
    }
  }

  // ── Submit order to CJ Dropshipping ──
  if (!process.env.CJ_API_KEY) {
    console.log("CJ_API_KEY not set — skipping CJ fulfilment");
    return;
  }

  try {
    await submitToCJ({ orderNumber, session: fullSession, items, meta });
  } catch (err) {
    // Non-fatal — log and continue (order already confirmed to customer)
    console.error("CJ order submission failed:", err);
  }
}

// ─── CJ submission ────────────────────────────────────────────────────────────

async function submitToCJ(args: {
  orderNumber: string;
  session: Stripe.Checkout.Session;
  items: Array<{ productId: string; name: string; size: string; color: string; quantity: number; lineItemId: string }>;
  meta: Record<string, string>;
}) {
  const { orderNumber, session, items, meta } = args;
  const addr = session.customer_details?.address;
  const customerName = session.customer_details?.name ?? meta.firstName ?? "Customer";
  const phone = session.customer_details?.phone ?? meta.phone ?? "0000000000";

  // Map country code → full country name (CJ requires both)
  const countryCode = addr?.country ?? "DE";
  const countryNames: Record<string, string> = {
    AT: "Austria", BE: "Belgium", BG: "Bulgaria", CY: "Cyprus", CZ: "Czech Republic",
    DE: "Germany", DK: "Denmark", EE: "Estonia", ES: "Spain", FI: "Finland",
    FR: "France", GR: "Greece", HR: "Croatia", HU: "Hungary", IE: "Ireland",
    IT: "Italy", LT: "Lithuania", LU: "Luxembourg", LV: "Latvia", MT: "Malta",
    NL: "Netherlands", PL: "Poland", PT: "Portugal", RO: "Romania", SE: "Sweden",
    SI: "Slovenia", SK: "Slovakia", GB: "United Kingdom", US: "United States",
  };
  const countryName = countryNames[countryCode] ?? countryCode;

  // Map items → CJ variant IDs
  const variantMap = cjProductMap as unknown as Record<string, string>;
  const cjProducts = items.map((item) => {
    const key = `${item.productId}:${item.color}:${item.size}`;
    const vid = variantMap[key];
    if (!vid || vid === "REPLACE_WITH_CJ_VID") {
      console.warn(`CJ: no variant ID mapped for key "${key}" — order may be rejected`);
    }
    return {
      vid: vid ?? "UNKNOWN",
      quantity: item.quantity,
      storeLineItemId: item.lineItemId,
    };
  });

  const orderInput: CJOrderInput = {
    orderNumber,
    shipping: {
      name: customerName,
      countryCode,
      country: countryName,
      province: addr?.state ?? meta.state ?? "",
      city: addr?.city ?? meta.city ?? "",
      address: [addr?.line1, addr?.line2].filter(Boolean).join(", ") || meta.address || "",
      zip: addr?.postal_code ?? meta.zip ?? "",
      phone,
    },
    products: cjProducts,
  };

  const response = await createCJOrder(orderInput);

  if (response.code === 200 && response.data?.orderId) {
    const cjOrderId = response.data.orderId;
    console.log(`CJ order created: ${cjOrderId} for ${orderNumber}`);

    // Update the stored order with the CJ order ID
    const orders = readOrders();
    const idx = orders.findIndex((o) => o.orderNumber === orderNumber);
    if (idx >= 0) {
      orders[idx].cjOrderId = cjOrderId;
      orders[idx].cjStatus = response.data.status;
      orders[idx].updatedAt = new Date().toISOString();
      writeOrders(orders);
    }
  } else {
    console.error(`CJ order creation failed (code ${response.code}): ${response.message}`);
  }
}
