/**
 * /api/cj — CJ Dropshipping webhook receiver
 *
 * Register this URL in your CJ dashboard via /api/cj-setup (run once).
 * CJ will POST to this endpoint whenever an order's logistics status changes.
 *
 * CJ webhook docs: https://developers.cjdropshipping.com/api2.0/v1/webhook/set
 */

import { NextRequest, NextResponse } from "next/server";
import { CJWebhookPayload, getCJOpenId } from "@/lib/cj";
import { updateOrderTracking } from "@/app/api/webhook/route";
import { Resend } from "resend";
import { readFileSync } from "fs";
import { join } from "path";

type StoredOrder = {
  orderNumber: string;
  cjOrderId?: string;
  customerEmail: string;
  customerName: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  cjStatus?: string;
};

function findOrderByCJId(cjOrderId: string): StoredOrder | undefined {
  try {
    const orders = JSON.parse(
      readFileSync(join(process.cwd(), "src/data/orders.json"), "utf-8")
    ) as StoredOrder[];
    return orders.find((o) => o.cjOrderId === cjOrderId);
  } catch {
    return undefined;
  }
}

const CJ_TRACKING_STATUS: Record<string, string> = {
  "0":  "Processing",
  "1":  "Shipped",
  "2":  "In Transit",
  "3":  "Out for Delivery",
  "4":  "Delivered",
  "5":  "Exception / Held",
  "6":  "Returned",
};

export async function POST(req: NextRequest) {
  let payload: CJWebhookPayload;

  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Verify openId matches our account (prevents spoofed webhooks)
  if (process.env.CJ_API_KEY) {
    try {
      const expectedOpenId = await getCJOpenId();
      if (payload.openId && payload.openId !== expectedOpenId) {
        console.warn("CJ webhook: openId mismatch", payload.openId);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } catch {
      // If auth check fails (e.g. no API key during test), proceed anyway
    }
  }

  console.log(`CJ webhook received: type=${payload.type} messageType=${payload.messageType}`, payload.params);

  // CJ must receive a 200 within 3 seconds — do heavy work asynchronously
  handleWebhookAsync(payload).catch((err) =>
    console.error("CJ webhook async handler error:", err)
  );

  // Respond immediately to CJ
  return NextResponse.json({ received: true });
}

async function handleWebhookAsync(payload: CJWebhookPayload) {
  switch (payload.type) {
    case "LOGISTIC":
      await handleLogisticUpdate(payload);
      break;
    case "ORDER":
      handleOrderUpdate(payload);
      break;
    default:
      console.log(`CJ webhook: unhandled type "${payload.type}"`);
  }
}

async function handleLogisticUpdate(payload: CJWebhookPayload) {
  const { orderId, trackingNumber, logisticName, trackingStatus } = payload.params;

  if (!orderId || !trackingNumber) {
    console.warn("CJ logistics webhook missing orderId or trackingNumber");
    return;
  }

  const humanStatus = CJ_TRACKING_STATUS[String(trackingStatus)] ?? `Status ${trackingStatus}`;

  console.log(`CJ tracking update — orderId: ${orderId}, carrier: ${logisticName}, tracking: ${trackingNumber}, status: ${humanStatus}`);

  // Update order in orders.json
  updateOrderTracking(orderId, {
    trackingNumber: String(trackingNumber),
    trackingCarrier: String(logisticName ?? ""),
    cjStatus: humanStatus,
  });

  // If this is the first tracking number (order just shipped), email the customer
  const order = findOrderByCJId(orderId);
  if (order && !order.trackingNumber && trackingNumber && trackingStatus === "1") {
    await sendShippingEmail(order, {
      trackingNumber: String(trackingNumber),
      carrier: String(logisticName ?? ""),
    });
  }
}

function handleOrderUpdate(payload: CJWebhookPayload) {
  console.log("CJ order status update:", payload.params);
  // Add further order status handling here if needed
}

async function sendShippingEmail(
  order: StoredOrder,
  tracking: { trackingNumber: string; carrier: string }
) {
  if (!order.customerEmail || !process.env.RESEND_API_KEY) return;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://the00sversion.com";

    const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="text-align:center;padding-bottom:32px;border-bottom:1px solid #1a1a1a;">
            <h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:4px;color:#C9A84C;text-transform:uppercase;">THE 00s VERSION</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 0;">
            <h2 style="color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">
              Your order is on its way 🚚
            </h2>
            <p style="color:#888;font-size:15px;line-height:1.6;margin:0 0 32px;">
              Hey ${order.customerName?.split(" ")[0] || "there"}, your order <strong style="color:#C9A84C;">${order.orderNumber}</strong> has been shipped!
            </p>

            <div style="background:#111;border:1px solid #1a1a1a;border-radius:4px;padding:24px;margin-bottom:32px;">
              <p style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">Tracking Number</p>
              <p style="color:#C9A84C;font-size:20px;font-weight:900;letter-spacing:2px;margin:0 0 8px;">${tracking.trackingNumber}</p>
              <p style="color:#555;font-size:13px;margin:0;">Carrier: ${tracking.carrier || "Your courier"}</p>
            </div>

            <div style="text-align:center;margin:32px 0;">
              <a href="${siteUrl}/track-order" style="background:#C9A84C;color:#080808;text-decoration:none;font-weight:900;font-size:14px;letter-spacing:2px;text-transform:uppercase;padding:16px 40px;display:inline-block;border-radius:4px;">
                Track Your Order
              </a>
            </div>

            <p style="color:#555;font-size:13px;text-align:center;line-height:1.6;">
              Standard delivery: 5–7 business days.<br>
              Questions? <a href="mailto:support@the00sversion.com" style="color:#C9A84C;">support@the00sversion.com</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #1a1a1a;padding-top:24px;text-align:center;">
            <p style="color:#333;font-size:11px;margin:0;">© The 00s Version · <a href="${siteUrl}/privacy-policy" style="color:#555;">Privacy</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    await resend.emails.send({
      from: "The 00s Version <orders@the00sversion.com>",
      to: order.customerEmail,
      subject: `Your order ${order.orderNumber} has shipped!`,
      html,
    });

    console.log(`Shipping email sent to ${order.customerEmail} for ${order.orderNumber}`);
  } catch (err) {
    console.error("Failed to send shipping email:", err);
  }
}
