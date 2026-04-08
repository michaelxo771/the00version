import { getProductById, products } from "@/lib/products";
import { notFound } from "next/navigation";
import { readFileSync } from "fs";
import { join } from "path";
import ProductDetail from "./ProductDetail";
import type { Review } from "@/components/ReviewSection";
import type { Metadata } from "next";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} — The 00s Version`,
    description: product.description,
    openGraph: {
      title: `${product.name} — The 00s Version`,
      description: product.description,
      type: "website",
    },
  };
}

function getProductReviews(productId: string): Review[] {
  try {
    const file = readFileSync(join(process.cwd(), "src/data/reviews.json"), "utf-8");
    const all: Review[] = JSON.parse(file);
    return all.filter((r) => r.productId === productId);
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const reviews = getProductReviews(id);

  return <ProductDetail product={product} related={related} initialReviews={reviews} />;
}
