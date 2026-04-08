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

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, items, subtotal } = await req.json();

    if (!email || !items || !items.length) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const carts = readCarts();

    // Remove any existing pending cart for this email
    const filtered = carts.filter((c) => c.email !== email);

    const newCart: PendingCart = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      email,
      firstName: firstName || "",
      items,
      subtotal,
      savedAt: new Date().toISOString(),
      emailSent: false,
    };

    filtered.push(newCart);
    writeCarts(filtered);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

// Called when order completes — remove from pending carts
export async function DELETE(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false }, { status: 400 });
    const carts = readCarts().filter((c) => c.email !== email);
    writeCarts(carts);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
