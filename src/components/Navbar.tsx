"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080808]/95 backdrop-blur-sm border-b border-[#1a1a1a]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/products"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-[#C9A84C] transition-colors"
              >
                Shop
              </Link>
              <Link
                href="/products?category=New"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-[#C9A84C] transition-colors"
              >
                New Drops
              </Link>
              <Link
                href="/products?category=Sets"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-[#C9A84C] transition-colors"
              >
                Sets
              </Link>
            </div>

            {/* Logo */}
            <Link href="/" className="flex flex-col items-center group">
              <span className="gold-shimmer text-xl sm:text-2xl font-black tracking-[0.1em] uppercase leading-none">
                THE 00s
              </span>
              <span className="text-[9px] tracking-[0.4em] uppercase text-neutral-500 mt-0.5">
                VERSION
              </span>
            </Link>

            {/* Right nav */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/products?category=Accessories"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-[#C9A84C] transition-colors"
              >
                Accessories
              </Link>
              <Link
                href="/products?category=Outerwear"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-[#C9A84C] transition-colors"
              >
                Outerwear
              </Link>
              <button
                onClick={toggleCart}
                className="relative text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 hover:text-[#C9A84C] transition-colors"
              >
                Cart
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-4 bg-[#C9A84C] text-[#080808] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile: cart + hamburger */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={toggleCart}
                className="relative text-neutral-300 hover:text-[#C9A84C] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#C9A84C] text-[#080808] text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-neutral-300 hover:text-[#C9A84C] transition-colors"
              >
                {menuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#080808] border-t border-[#1a1a1a]">
            <div className="px-6 py-4 flex flex-col gap-4">
              {["Shop", "New Drops", "Sets", "Accessories", "Outerwear"].map((item) => (
                <Link
                  key={item}
                  href={`/products${item !== "Shop" ? `?category=${item.replace(" ", "")}` : ""}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-300 hover:text-[#C9A84C] transition-colors py-1"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Gold top stripe */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent z-50 opacity-60" />
    </>
  );
}
