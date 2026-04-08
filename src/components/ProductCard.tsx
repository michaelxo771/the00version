"use client";

import Link from "next/link";
import { Product } from "@/lib/products";

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="product-card relative">
        {/* Image container */}
        <div className="relative overflow-hidden bg-[#111111] aspect-[3/4] rounded-sm mb-4">
          {/* Placeholder visual */}
          <div className="product-img absolute inset-0 transition-transform duration-500 ease-out flex flex-col items-center justify-center gap-2 p-6">
            <div className="w-full h-full flex flex-col items-center justify-center">
              <div className="border border-[#C9A84C]/20 rounded w-3/4 h-3/4 flex items-center justify-center group-hover:border-[#C9A84C]/40 transition-colors">
                <div className="text-center px-3">
                  <div className="gold-text text-xs font-black uppercase tracking-[0.2em] leading-relaxed">
                    {product.category}
                  </div>
                  <div className="text-neutral-300 text-sm font-bold mt-2 leading-tight">
                    {product.name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Badges — stacked top-left */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.badge && (
              <span
                className={`text-[10px] font-black uppercase tracking-[0.12em] px-2.5 py-1 rounded-sm w-fit ${
                  product.badge === "Sale"
                    ? "bg-red-600 text-white"
                    : product.badge === "Limited"
                    ? "bg-[#C9A84C] text-[#080808]"
                    : "bg-white text-[#080808]"
                }`}
              >
                {product.badge}
              </span>
            )}
            {product.lowStock && (
              <span className="text-[10px] font-black uppercase tracking-[0.12em] px-2.5 py-1 rounded-sm bg-red-600/90 text-white w-fit">
                Low Stock
              </span>
            )}
          </div>

          {/* Sold out overlay */}
          {product.soldOut && (
            <div className="absolute inset-0 bg-[#080808]/70 flex items-center justify-center z-10">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 border border-neutral-600 px-4 py-2">
                Sold Out
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Info */}
        <div className="px-1">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-600 mb-1">
                {product.category}
              </p>
              <h3 className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors line-clamp-2 leading-snug">
                {product.name}
              </h3>
              {product.lowStock && (
                <p className="text-[10px] text-red-400 font-semibold mt-1 uppercase tracking-wider">
                  Only a few left
                </p>
              )}
            </div>
            <div className="text-right flex-shrink-0">
              {product.originalPrice && (
                <p className="text-xs text-neutral-600 line-through">
                  €{product.originalPrice}
                </p>
              )}
              <p className={`text-sm font-bold ${product.originalPrice ? "text-[#C9A84C]" : "text-neutral-200"}`}>
                €{product.price}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
