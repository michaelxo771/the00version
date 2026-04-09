/**
 * /api/cj-setup — One-time CJ Dropshipping setup
 *
 * Call this ONCE after deploying to production to register your /api/cj webhook
 * URL with CJ. Protect it with SETUP_SECRET so only you can trigger it.
 *
 * Usage:
 *   curl -X POST https://the00sversion.com/api/cj-setup \
 *     -H "Authorization: Bearer YOUR_SETUP_SECRET"
 *
 * Or visit in browser (GET) to see current status without registering.
 */

import { NextResponse } from "next/server";
import { registerCJWebhook, getCJOpenId } from "@/lib/cj";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://the00sversion.com";

export async function GET() {
  if (!process.env.CJ_API_KEY) {
    return NextResponse.json({ ok: false, error: "CJ_API_KEY not set" }, { status: 500 });
  }

  try {
    const openId = await getCJOpenId();
    return NextResponse.json({
      ok: true,
      openId,
      webhookUrl: `${SITE_URL}/api/cj`,
      message: "CJ credentials valid. POST this endpoint to register the webhook.",
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Auth failed" },
      { status: 500 }
    );
  }
}

export async function POST() {
  if (!process.env.CJ_API_KEY) {
    return NextResponse.json({ ok: false, error: "CJ_API_KEY not set" }, { status: 500 });
  }

  const webhookUrl = `${SITE_URL}/api/cj`;

  try {
    const result = await registerCJWebhook(webhookUrl);

    if (result.code === 200) {
      const openId = await getCJOpenId();
      return NextResponse.json({
        ok: true,
        message: `Webhook registered: ${webhookUrl}`,
        openId,
        cjResponse: result,
      });
    } else {
      return NextResponse.json(
        { ok: false, error: `CJ returned code ${result.code}: ${result.message}` },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Registration failed" },
      { status: 500 }
    );
  }
}
