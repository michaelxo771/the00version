"use client";

import { useState, useEffect } from "react";

export default function EmailPopup() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Don't show if already dismissed this session
    const alreadySeen = sessionStorage.getItem("popup-dismissed");
    if (alreadySeen) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    setDismissed(true);
    setVisible(false);
    sessionStorage.setItem("popup-dismissed", "1");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(dismiss, 2500);
  }

  if (!visible || dismissed) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[60]"
        onClick={dismiss}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[61] flex items-center justify-center px-4 pointer-events-none">
        <div
          className="relative w-full max-w-md bg-[#0d0d0d] border border-[#C9A84C] rounded-sm pointer-events-auto"
          style={{ boxShadow: "0 0 60px rgba(201,168,76,0.15)" }}
        >
          {/* Gold top bar */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />

          {/* Close button */}
          <button
            onClick={dismiss}
            className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-200 transition-colors z-10"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8 sm:p-10 text-center">
            {submitted ? (
              <div className="py-4">
                <div className="w-14 h-14 rounded-full border border-[#C9A84C] flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">You&apos;re In</h3>
                <p className="text-neutral-500 text-sm">
                  Check your inbox for your 10% off code.
                </p>
              </div>
            ) : (
              <>
                {/* Eyebrow */}
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="h-[1px] w-8 bg-[#C9A84C]/50" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#C9A84C]">
                    Exclusive Offer
                  </span>
                  <div className="h-[1px] w-8 bg-[#C9A84C]/50" />
                </div>

                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight mb-3">
                  Join the<br />
                  <span className="gold-shimmer">Inner Circle</span>
                </h2>

                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Get <span className="text-[#C9A84C] font-bold">10% off your first order</span> +{" "}
                  early access to every drop. No spam, ever.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-600 px-4 py-3.5 text-sm rounded-sm outline-none transition-colors text-center"
                  />
                  <button
                    type="submit"
                    className="btn-gold w-full py-3.5 text-sm rounded-sm"
                  >
                    Claim My 10% Off
                  </button>
                </form>

                <button
                  onClick={dismiss}
                  className="mt-4 text-[11px] text-neutral-600 hover:text-neutral-400 transition-colors uppercase tracking-wider"
                >
                  No thanks, I&apos;ll pay full price
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
