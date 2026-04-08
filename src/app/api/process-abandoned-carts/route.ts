import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

type PendingCart = {
  id: string;
  email: string;
  firstName: string;
  items: { name: string; price: number; quantity: number }[];
  subtotal: number;
  savedAt: string;
  emailSent: boolean;
};

const CARTS_FILE = join(process.cwd(), "src/data/pending-carts.json");
const ONE_HOUR_MS = 60 * 60 * 1000;

function readCarts(): PendingCart[] {
  try {
    return JSON.parse(readFileSync(CARTS_FILE, "utf-8")) as PendingCart[];
  } catch {
    return [];
  }
}

function writeCarts(carts: PendingCart[]) {
  writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2));
}

function buildAbandonedCartEmail(cart: PendingCart, siteUrl: string): string {
  const firstName = cart.firstName || "there";
  const itemRows = cart.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px 0;color:#aaa;font-size:14px;">${item.name} × ${item.quantity}</td>
      <td style="padding:8px 0;color:#C9A84C;font-size:14px;text-align:right;font-weight:bold;">€${(item.price * item.quantity).toFixed(2)}</td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080808;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="text-align:center;padding-bottom:32px;border-bottom:1px solid #1a1a1a;">
            <h1 style="margin:0;font-size:28px;font-weight:900;letter-spacing:4px;color:#C9A84C;text-transform:uppercase;">THE 00s VERSION</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px 0;">
            <h2 style="color:#fff;font-size:22px;font-weight:900;text-transform:uppercase;letter-spacing:2px;margin:0 0 12px;">Hey ${firstName}, you left something behind</h2>
            <p style="color:#888;font-size:15px;line-height:1.6;margin:0 0 32px;">You had some fire pieces in your cart. They won&apos;t be around forever — grab them before they&apos;re gone.</p>

            <!-- Cart items -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1a1a1a;border-radius:4px;overflow:hidden;background:#111;">
              <tr><td style="padding:20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${itemRows}
                  <tr>
                    <td style="padding-top:12px;border-top:1px solid #1a1a1a;color:#fff;font-size:14px;font-weight:bold;">Subtotal</td>
                    <td style="padding-top:12px;border-top:1px solid #1a1a1a;color:#C9A84C;font-size:16px;font-weight:900;text-align:right;">€${cart.subtotal.toFixed(2)}</td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- Promo code -->
            <div style="background:#0d0d0d;border:1px solid #C9A84C;border-radius:4px;padding:20px;margin:24px 0;text-align:center;">
              <p style="color:#888;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;">Use code at checkout</p>
              <p style="color:#C9A84C;font-size:24px;font-weight:900;letter-spacing:4px;margin:0;">CART10</p>
              <p style="color:#888;font-size:12px;margin:8px 0 0;">10% off your order — limited time</p>
            </div>

            <!-- CTA -->
            <div style="text-align:center;margin:32px 0;">
              <a href="${siteUrl}/checkout" style="background:#C9A84C;color:#080808;text-decoration:none;font-weight:900;font-size:14px;letter-spacing:2px;text-transform:uppercase;padding:16px 40px;display:inline-block;border-radius:4px;">
                Complete Your Order
              </a>
            </div>

            <p style="color:#555;font-size:12px;text-align:center;">
              Free shipping on orders over €150. Easy 14-day returns.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="border-top:1px solid #1a1a1a;padding-top:24px;text-align:center;">
            <p style="color:#333;font-size:11px;margin:0;">© The 00s Version · <a href="${siteUrl}/privacy-policy" style="color:#555;">Privacy Policy</a></p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// GET — trigger this from a cron job (e.g. Vercel Cron, Cloudflare Workers, or any cron service)
// Protect with CRON_SECRET env var
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 500 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://the00sversion.com";
  const carts = readCarts();
  const now = Date.now();
  let sent = 0;

  const updated = await Promise.all(
    carts.map(async (cart) => {
      if (cart.emailSent) return cart;
      const age = now - new Date(cart.savedAt).getTime();
      if (age < ONE_HOUR_MS) return cart;

      try {
        const { Resend } = await import("resend");
        const resend = new Resend(RESEND_API_KEY);
        await resend.emails.send({
          from: "The 00s Version <orders@the00sversion.com>",
          to: cart.email,
          subject: "You left something behind...",
          html: buildAbandonedCartEmail(cart, siteUrl),
        });
        sent++;
        return { ...cart, emailSent: true };
      } catch {
        return cart;
      }
    })
  );

  // Remove carts older than 48 hours that have been sent
  const cleaned = updated.filter((c) => {
    if (!c.emailSent) return true;
    return now - new Date(c.savedAt).getTime() < 48 * 60 * 60 * 1000;
  });

  writeCarts(cleaned);

  return NextResponse.json({ processed: carts.length, sent });
}
