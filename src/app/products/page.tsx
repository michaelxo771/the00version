"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { products, categories } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    if (categoryParam) {
      const matched = categories.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase()
      );
      setActiveCategory(matched || "All");
    }
  }, [categoryParam]);

  const filtered = products.filter((p) =>
    activeCategory === "All" ? true : p.category === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div>
      {/* Page header */}
      <div className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,168,76,0.06)_0%,_transparent_60%)]" />
        <div className="relative">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#C9A84C] mb-3">
            {activeCategory === "All" ? "Full Collection" : activeCategory}
          </p>
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
            {activeCategory === "All" ? "All Products" : activeCategory}
          </h1>
          <p className="text-neutral-500 text-sm mt-3">{sorted.length} items</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-10">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] font-semibold uppercase tracking-[0.1em] px-4 py-2 rounded-sm border transition-all ${
                  activeCategory === cat
                    ? "bg-[#C9A84C] text-[#080808] border-[#C9A84C]"
                    : "border-[#2a2a2a] text-neutral-400 hover:border-[#C9A84C]/50 hover:text-neutral-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#111111] border border-[#2a2a2a] text-neutral-400 text-xs uppercase tracking-wider px-4 py-2.5 rounded-sm focus:border-[#C9A84C] outline-none cursor-pointer"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        {/* Grid */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sorted.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-neutral-600 uppercase tracking-widest text-sm">
              No products found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
