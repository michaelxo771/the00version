"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function StickyShopButton() {
  const [show, setShow] = useState(false);
  const heroRef = useRef<number>(0);

  useEffect(() => {
    // Show after scrolling past ~100vh
    function onScroll() {
      const pastHero = window.scrollY > window.innerHeight * 0.85;
      setShow(pastHero);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-0 right-0 flex justify-center z-40 md:hidden transition-all duration-300 ${
        show ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0 pointer-events-none"
      }`}
    >
      <Link
        href="/products"
        className="btn-gold px-10 py-4 text-sm rounded-full shadow-lg shadow-[#C9A84C]/20"
        style={{ minWidth: "180px", textAlign: "center" }}
      >
        Shop Now
      </Link>
    </div>
  );
}
