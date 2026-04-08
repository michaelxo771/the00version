"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const pref = localStorage.getItem("cookie-consent");
    if (!pref) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-5">
      <div
        className="max-w-4xl mx-auto bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ boxShadow: "0 -4px 40px rgba(0,0,0,0.6)" }}
      >
        {/* Gold top accent */}
        <div className="absolute top-0 left-4 right-4 sm:left-5 sm:right-5 h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />

        {/* Cookie icon */}
        <div className="flex-shrink-0 w-8 h-8 border border-[#2a2a2a] rounded flex items-center justify-center text-base">
          🍪
        </div>

        {/* Text */}
        <p className="flex-1 text-sm text-neutral-400 leading-relaxed">
          We use cookies to improve your experience and analyse site traffic.
          By continuing you agree to our{" "}
          <Link href="/privacy-policy" className="text-[#C9A84C] hover:underline">
            cookie policy
          </Link>
          .
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors uppercase tracking-wider"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="btn-gold px-5 py-2.5 text-xs rounded-sm whitespace-nowrap"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
