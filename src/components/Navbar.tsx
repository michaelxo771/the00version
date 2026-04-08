"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { products } from "@/lib/products";

export default function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const searchResults = searchQuery.trim().length > 1
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setSearchQuery("");
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080808]/95 backdrop-blur-sm border-b border-[#1a1a1a]"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
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
            <Link href="/" className="flex flex-col items-center group" aria-label="The 00s Version — Home">
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

              {/* Search icon */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="text-neutral-400 hover:text-[#C9A84C] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              <button
                onClick={toggleCart}
                aria-label={`Cart, ${totalItems} items`}
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

            {/* Mobile: search + cart + hamburger */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="text-neutral-300 hover:text-[#C9A84C] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button
                onClick={toggleCart}
                aria-label={`Cart, ${totalItems} items`}
                className="relative text-neutral-300 hover:text-[#C9A84C] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                className="text-neutral-300 hover:text-[#C9A84C] transition-colors"
              >
                {menuOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
              {[
                { label: "Shop", href: "/products" },
                { label: "New Drops", href: "/products?category=NewDrops" },
                { label: "Sets", href: "/products?category=Sets" },
                { label: "Accessories", href: "/products?category=Accessories" },
                { label: "Outerwear", href: "/products?category=Outerwear" },
                { label: "Size Guide", href: "/size-guide" },
                { label: "Track Order", href: "/track-order" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold uppercase tracking-[0.15em] text-neutral-300 hover:text-[#C9A84C] transition-colors py-1"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Gold top stripe */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent z-50 opacity-60" aria-hidden="true" />

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] bg-[#080808]/95 backdrop-blur-sm flex flex-col items-center pt-24 px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <button
            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
            aria-label="Close search"
            className="absolute top-6 right-6 text-neutral-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="w-full max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-[#C9A84C] mb-4 text-center">Search</p>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  aria-label="Search products"
                  className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-600 text-lg pl-12 pr-4 py-4 rounded-sm outline-none transition-colors"
                />
              </div>
            </form>

            {/* Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 border border-[#1a1a1a] rounded-sm overflow-hidden" role="listbox" aria-label="Search results">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                    role="option"
                    aria-selected="false"
                    className="flex items-center justify-between px-5 py-4 bg-[#0d0d0d] hover:bg-[#111111] border-b border-[#1a1a1a] last:border-0 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-neutral-200 group-hover:text-white">{p.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-neutral-600 mt-0.5">{p.category}</p>
                    </div>
                    <span className="text-[#C9A84C] font-bold text-sm">€{p.price}</span>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery.trim().length > 1 && searchResults.length === 0 && (
              <p className="mt-6 text-center text-neutral-600 text-sm">No products found for &ldquo;{searchQuery}&rdquo;</p>
            )}

            {searchQuery.trim().length <= 1 && (
              <div className="mt-8">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-600 mb-4">Popular categories</p>
                <div className="flex flex-wrap gap-2">
                  {["Hoodies", "T-Shirts", "Bottoms", "Outerwear", "Sets", "Accessories"].map((cat) => (
                    <Link
                      key={cat}
                      href={`/products?category=${cat}`}
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                      className="text-xs uppercase tracking-wider px-4 py-2 border border-[#2a2a2a] text-neutral-400 hover:border-[#C9A84C]/50 hover:text-neutral-200 rounded-sm transition-all"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
