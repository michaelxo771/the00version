import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { Review } from "@/components/ReviewSection";

const REVIEWS_FILE = join(process.cwd(), "src/data/reviews.json");

function readReviews(): Review[] {
  try {
    return JSON.parse(readFileSync(REVIEWS_FILE, "utf-8")) as Review[];
  } catch {
    return [];
  }
}

function writeReviews(reviews: Review[]) {
  writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const reviews = readReviews();
  const filtered = productId ? reviews.filter((r) => r.productId === productId) : reviews;
  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, name, rating, title, body: reviewBody } = body;

    if (!productId || !name || !rating || !title || !reviewBody) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
    }

    const reviews = readReviews();
    const newReview: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      productId,
      name: String(name).slice(0, 60),
      rating: Math.round(rating),
      title: String(title).slice(0, 120),
      body: String(reviewBody).slice(0, 1000),
      verified: false,
      createdAt: new Date().toISOString(),
    };

    reviews.unshift(newReview);
    writeReviews(reviews);

    return NextResponse.json(newReview, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
