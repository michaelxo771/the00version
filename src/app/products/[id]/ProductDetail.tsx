"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import ProductCard from "@/components/ProductCard";
import { getStock, getStockLabel, isOutOfStock } from "@/lib/stock";
import ReviewSection, { Review } from "@/components/ReviewSection";

type Props = {
  product: Product;
  related: Product[];
  initialReviews: Review[];
};

export default function ProductDetail({ product, related, initialReviews }: Props) {
  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  const stockLabel = getStockLabel(product.id);
  const outOfStock = isOutOfStock(product.id) || !!product.soldOut;
  const stockQty = getStock(product.id);

  function handleAddToCart() {
    if (outOfStock) return;
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 2000);
      return;
    }
    addItem({
      product,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 2000);
    openCart();
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-4">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] text-neutral-600">
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#C9A84C] transition-colors">Products</Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-[#C9A84C] transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-neutral-400 truncate max-w-[150px]">{product.name}</span>
        </nav>
      </div>

      {/* Main product */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16">
          {/* Product image */}
          <div className="space-y-4">
            {/* Main image */}
            <div className="relative bg-[#111111] aspect-[3/4] rounded-sm overflow-hidden border border-[#1a1a1a]">
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={`text-[11px] font-black uppercase tracking-[0.12em] px-3 py-1.5 rounded-sm ${
                      product.badge === "Sale"
                        ? "bg-red-600 text-white"
                        : product.badge === "Limited"
                        ? "bg-[#C9A84C] text-[#080808]"
                        : "bg-white text-[#080808]"
                    }`}
                  >
                    {product.badge}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                {/* Decorative placeholder */}
                <div className="border border-[#C9A84C]/15 w-3/4 h-3/4 flex items-center justify-center">
                  <div className="text-center px-6">
                    <div className="gold-text text-sm font-black uppercase tracking-[0.25em] mb-3">
                      {product.category}
                    </div>
                    <div className="text-neutral-300 text-2xl font-black leading-tight uppercase tracking-tight">
                      {product.name}
                    </div>
                    <div className="mt-4 text-[#C9A84C] text-xl font-black">
                      €{product.price}
                    </div>
                  </div>
                </div>
                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-6 h-6">
                  <div className="w-full h-[1px] bg-[#C9A84C]/40" />
                  <div className="w-[1px] h-full bg-[#C9A84C]/40" />
                </div>
                <div className="absolute top-4 right-4 w-6 h-6">
                  <div className="w-full h-[1px] bg-[#C9A84C]/40" />
                  <div className="w-[1px] h-full bg-[#C9A84C]/40 ml-auto" />
                </div>
                <div className="absolute bottom-4 left-4 w-6 h-6">
                  <div className="w-[1px] h-full bg-[#C9A84C]/40" />
                  <div className="w-full h-[1px] bg-[#C9A84C]/40" />
                </div>
                <div className="absolute bottom-4 right-4 w-6 h-6">
                  <div className="w-[1px] h-full bg-[#C9A84C]/40 ml-auto" />
                  <div className="w-full h-[1px] bg-[#C9A84C]/40" />
                </div>
              </div>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className={`bg-[#111111] aspect-square w-20 rounded-sm border ${
                    i === 0 ? "border-[#C9A84C]" : "border-[#1a1a1a] opacity-50"
                  } flex items-center justify-center cursor-pointer`}
                >
                  <span className="text-[8px] text-neutral-600 uppercase tracking-wider">
                    {i === 0 ? "Front" : "Back"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="lg:pt-2">
            {/* Category */}
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#C9A84C] mb-3">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-black text-[#C9A84C]">€{product.price}</span>
              {product.originalPrice && (
                <span className="text-lg text-neutral-600 line-through">
                  €{product.originalPrice}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-sm text-red-400 font-semibold">
                  Save €{product.originalPrice - product.price}
                </span>
              )}
            </div>

            {/* Stock status */}
            {stockLabel && (
              <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-sm mb-4 ${
                outOfStock
                  ? "bg-neutral-800 text-neutral-500"
                  : stockQty <= 2
                  ? "bg-red-600/20 text-red-400 border border-red-600/30"
                  : "bg-amber-600/20 text-amber-400 border border-amber-600/30"
              }`}>
                <span>{outOfStock ? "⊘" : "!"}</span>
                {stockLabel}
              </div>
            )}

            {/* Description */}
            <p className="text-neutral-400 leading-relaxed mb-8 text-sm">
              {product.description}
            </p>

            {/* Divider */}
            <div className="h-[1px] bg-gradient-to-r from-[#C9A84C]/30 to-transparent mb-8" />

            {/* Color selector */}
            <div className="mb-6">
              <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-3">
                Color: <span className="text-neutral-200">{selectedColor}</span>
              </p>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 text-xs border rounded-sm uppercase tracking-wider font-medium transition-all ${
                      selectedColor === color
                        ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10"
                        : "border-[#2a2a2a] text-neutral-500 hover:border-[#C9A84C]/40 hover:text-neutral-300"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-[11px] uppercase tracking-[0.2em] ${sizeError ? "text-red-400" : "text-neutral-400"}`}>
                  {sizeError ? "Please select a size" : "Size"}
                  {selectedSize && !sizeError && (
                    <span className="text-neutral-200 ml-1">{selectedSize}</span>
                  )}
                </p>
                <Link href="/size-guide" className="text-[10px] uppercase tracking-wider text-[#C9A84C] hover:underline">
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setSizeError(false);
                    }}
                    className={`min-w-[3rem] h-10 px-3 text-sm border rounded-sm font-semibold transition-all ${
                      selectedSize === size
                        ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10"
                        : sizeError
                        ? "border-red-400/40 text-neutral-500 hover:border-[#C9A84C]/40"
                        : "border-[#2a2a2a] text-neutral-500 hover:border-[#C9A84C]/40 hover:text-neutral-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 mb-6">
              {/* Qty */}
              <div className="flex items-center border border-[#2a2a2a] rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-12 text-neutral-400 hover:text-white transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-10 h-12 flex items-center justify-center text-sm font-bold border-x border-[#2a2a2a]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-12 text-neutral-400 hover:text-white transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                aria-label={outOfStock ? "Out of stock" : "Add to cart"}
                className={`flex-1 h-12 text-sm rounded-sm font-bold uppercase tracking-[0.1em] transition-all ${
                  outOfStock
                    ? "bg-[#1a1a1a] text-neutral-600 cursor-not-allowed border border-[#2a2a2a]"
                    : addedFeedback
                    ? "bg-green-600 text-white"
                    : "btn-gold"
                }`}
              >
                {outOfStock
                  ? "Out of Stock"
                  : addedFeedback
                  ? "Added to Cart ✓"
                  : "Add to Cart"}
              </button>
            </div>

            {/* Shipping note */}
            <div className="flex items-center gap-2 text-[11px] text-neutral-600 mb-8">
              <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Free shipping on orders over €150
            </div>

            {/* Details */}
            <div className="border-t border-[#1a1a1a] pt-6">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] mb-4">Product Details</h3>
              <ul className="space-y-2">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-3 text-sm text-neutral-400">
                    <span className="text-[#C9A84C] mt-1 flex-shrink-0">—</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReviewSection productId={product.id} initialReviews={initialReviews} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#1a1a1a]">
          <div className="mb-8">
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-2">More Like This</p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
