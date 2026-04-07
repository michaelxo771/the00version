"use client";

import { useState } from "react";

export default function EmailSignup() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div>
      {submitted ? (
        <p className="text-[#C9A84C] font-semibold text-sm uppercase tracking-wider">
          You&apos;re in. Welcome to the circle.
        </p>
      ) : (
        <>
          <form
            className="flex gap-3 max-w-md mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              className="flex-1 bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-600 px-4 py-3.5 text-sm rounded outline-none transition-colors"
            />
            <button type="submit" className="btn-gold px-6 py-3.5 text-xs rounded whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-neutral-700 text-[10px] mt-4 uppercase tracking-wider">
            No spam. Unsubscribe anytime.
          </p>
        </>
      )}
    </div>
  );
}
