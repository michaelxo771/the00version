// Branded order confirmation email sent via Resend.
// Returns a plain HTML string so there's no React Email dependency.

type OrderEmailProps = {
  firstName: string;
  orderNumber: string;
  items: Array<{ name: string; size: string; color: string; quantity: number; unitPrice: number }>;
  subtotal: number;
  discountAmount: number;
  shippingCost: number;
  total: number;
  shippingMethod: string;
};

const deliveryLabels: Record<string, string> = {
  standard: "5–7 business days",
  express: "2–3 business days",
  overnight: "Next business day",
};

export function buildOrderEmail(p: OrderEmailProps): string {
  const gold = "#C9A84C";
  const bg = "#080808";
  const card = "#111111";
  const border = "#1a1a1a";
  const textMuted = "#8a8a8a";

  const itemRows = p.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid ${border};">
          <div style="font-size:13px;font-weight:600;color:#e5e5e5;">${item.name}</div>
          <div style="font-size:11px;color:${textMuted};margin-top:2px;">${item.size} · ${item.color} · Qty ${item.quantity}</div>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid ${border};text-align:right;font-size:13px;font-weight:700;color:${gold};">
          €${(item.unitPrice * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  const discountRow =
    p.discountAmount > 0
      ? `<tr>
          <td style="padding:6px 0;font-size:12px;color:#4ade80;">Discount</td>
          <td style="padding:6px 0;font-size:12px;font-weight:700;color:#4ade80;text-align:right;">−€${p.discountAmount.toFixed(2)}</td>
        </tr>`
      : "";

  const shippingRow =
    p.shippingCost === 0
      ? `<tr>
          <td style="padding:6px 0;font-size:12px;color:${textMuted};">Shipping</td>
          <td style="padding:6px 0;font-size:12px;font-weight:700;color:#4ade80;text-align:right;">FREE</td>
        </tr>`
      : `<tr>
          <td style="padding:6px 0;font-size:12px;color:${textMuted};">Shipping</td>
          <td style="padding:6px 0;font-size:12px;font-weight:700;color:#e5e5e5;text-align:right;">€${p.shippingCost.toFixed(2)}</td>
        </tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>Order Confirmed — The 00s Version</title>
</head>
<body style="margin:0;padding:0;background:${bg};font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${bg};min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:8px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td colspan="2" style="height:2px;background:linear-gradient(90deg,transparent,${gold},transparent);"></td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:32px 0 24px;">
              <div style="font-size:28px;font-weight:900;letter-spacing:0.08em;text-transform:uppercase;color:${gold};">
                THE 00s VERSION
              </div>
              <div style="font-size:10px;letter-spacing:0.4em;text-transform:uppercase;color:${textMuted};margin-top:4px;">
                PREMIUM STREETWEAR
              </div>
            </td>
          </tr>

          <!-- Success badge -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <div style="width:56px;height:56px;border-radius:50%;border:2px solid ${gold};display:inline-flex;align-items:center;justify-content:center;font-size:24px;color:${gold};">✓</div>
              <div style="font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:${gold};margin-top:10px;">Order Confirmed</div>
              <h1 style="font-size:24px;font-weight:900;text-transform:uppercase;color:#e5e5e5;margin:8px 0 4px;letter-spacing:-0.02em;">
                Thank You, ${p.firstName}
              </h1>
              <p style="font-size:13px;color:${textMuted};margin:0;">
                Your order is confirmed and we're getting it ready.
              </p>
            </td>
          </tr>

          <!-- Order details card -->
          <tr>
            <td style="background:${card};border:1px solid ${border};border-radius:2px;padding:24px;">

              <!-- Order meta -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="width:50%;padding-right:8px;">
                    <div style="background:${bg};border:1px solid ${border};padding:12px;border-radius:2px;">
                      <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:${textMuted};margin-bottom:4px;">Order Number</div>
                      <div style="font-size:13px;font-weight:700;color:#e5e5e5;">${p.orderNumber}</div>
                    </div>
                  </td>
                  <td style="width:50%;padding-left:8px;">
                    <div style="background:${bg};border:1px solid ${border};padding:12px;border-radius:2px;">
                      <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:${textMuted};margin-bottom:4px;">Estimated Delivery</div>
                      <div style="font-size:13px;font-weight:700;color:#e5e5e5;">${deliveryLabels[p.shippingMethod] ?? "5–7 business days"}</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Gold divider -->
              <div style="height:1px;background:linear-gradient(90deg,${gold}60,transparent);margin-bottom:20px;"></div>

              <!-- Items heading -->
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:${gold};margin-bottom:4px;">Items Ordered</div>

              <!-- Items table -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
              </table>

              <!-- Totals -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;border-top:1px solid ${border};padding-top:16px;">
                <tr>
                  <td style="padding:6px 0;font-size:12px;color:${textMuted};">Subtotal</td>
                  <td style="padding:6px 0;font-size:12px;font-weight:700;color:#e5e5e5;text-align:right;">€${p.subtotal.toFixed(2)}</td>
                </tr>
                ${discountRow}
                ${shippingRow}
                <tr>
                  <td style="padding:12px 0 4px;border-top:1px solid ${border};font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#e5e5e5;">Total</td>
                  <td style="padding:12px 0 4px;border-top:1px solid ${border};font-size:18px;font-weight:900;color:${gold};text-align:right;">€${p.total.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- What happens next -->
          <tr>
            <td style="padding:24px 0 0;">
              <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.2em;color:${gold};margin-bottom:12px;">What Happens Next</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${[
                  ["1", "Order Processing", "We're picking and packing your order now."],
                  ["2", "Dispatched", "You'll receive a shipping confirmation with tracking."],
                  ["3", "Delivered", `Arrives in ${deliveryLabels[p.shippingMethod] ?? "5–7 business days"}.`],
                ]
                  .map(
                    ([num, title, desc]) => `
                <tr>
                  <td style="width:32px;vertical-align:top;padding:0 12px 16px 0;">
                    <div style="width:24px;height:24px;border-radius:50%;background:${border};border:1px solid ${gold}40;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;color:${gold};">${num}</div>
                  </td>
                  <td style="padding-bottom:16px;">
                    <div style="font-size:13px;font-weight:700;color:#e5e5e5;">${title}</div>
                    <div style="font-size:12px;color:${textMuted};margin-top:2px;">${desc}</div>
                  </td>
                </tr>`
                  )
                  .join("")}
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td align="center" style="padding:24px 0;">
              <a href="https://the00sversion.com/products" style="display:inline-block;background:linear-gradient(135deg,${gold},#f3d97a,${gold});color:#080808;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;padding:14px 32px;text-decoration:none;border-radius:2px;">
                Keep Shopping
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid ${border};padding-top:24px;text-align:center;">
              <div style="font-size:10px;color:#444;letter-spacing:0.1em;">
                © ${new Date().getFullYear()} The 00s Version · All rights reserved
              </div>
              <div style="font-size:10px;color:#333;margin-top:6px;">
                <a href="https://the00sversion.com/privacy-policy" style="color:#555;text-decoration:none;">Privacy Policy</a>
                &nbsp;·&nbsp;
                <a href="https://the00sversion.com/terms" style="color:#555;text-decoration:none;">Terms</a>
                &nbsp;·&nbsp;
                <a href="https://the00sversion.com/returns" style="color:#555;text-decoration:none;">Returns</a>
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
