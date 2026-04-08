"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { validatePromoCode } from "@/lib/promoCodes";

type Step = "information" | "shipping" | "payment";

export default function CheckoutPage() {
  const { state, subtotal } = useCart();
  const [step, setStep] = useState<Step>("information");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Promo code state
  const [promoInput, setPromoInput] = useState("");
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoLabel, setPromoLabel] = useState("");
  const [promoError, setPromoError] = useState<string | null>(null);

  const shippingCosts: Record<string, number> = {
    standard: subtotal >= 150 ? 0 : 12,
    express: 24,
    overnight: 40,
  };

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    shippingMethod: "standard",
  });

  const shipping = shippingCosts[form.shippingMethod] ?? 12;
  const discountAmount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
  const total = subtotal - discountAmount + shipping;

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function applyPromo() {
    setPromoError(null);
    const trimmed = promoInput.trim().toUpperCase();
    if (!trimmed) {
      setPromoError("Please enter a promo code.");
      return;
    }
    if (promoCode === trimmed) {
      setPromoError("This code is already applied.");
      return;
    }
    const result = validatePromoCode(trimmed);
    if (!result) {
      setPromoError("Invalid promo code. Please check and try again.");
      return;
    }
    setPromoCode(result.code);
    setDiscountPercent(result.discountPercent);
    setPromoLabel(result.label);
    setPromoInput("");
  }

  function removePromo() {
    setPromoCode(null);
    setDiscountPercent(0);
    setPromoLabel("");
    setPromoError(null);
  }

  async function handleStripeCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: state.items,
          customerInfo: {
            email: form.email,
            firstName: form.firstName,
            lastName: form.lastName,
            address: form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            phone: form.phone,
          },
          shippingMethod: form.shippingMethod,
          promoCode: promoCode ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error ?? "Failed to create checkout session");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-neutral-500 text-sm mb-4">Your cart is empty.</p>
          <Link href="/products" className="btn-gold px-8 py-3.5 text-sm rounded-sm inline-block">
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="gold-shimmer text-2xl font-black tracking-[0.1em] uppercase">
              THE 00s VERSION
            </span>
          </Link>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-10">
          {(["information", "shipping", "payment"] as const).map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-black transition-all ${
                    s === step
                      ? "border-[#C9A84C] bg-[#C9A84C] text-[#080808]"
                      : i < ["information", "shipping", "payment"].indexOf(step)
                      ? "border-[#C9A84C] bg-[#C9A84C]/20 text-[#C9A84C]"
                      : "border-[#2a2a2a] text-neutral-600"
                  }`}
                >
                  {i < ["information", "shipping", "payment"].indexOf(step) ? "✓" : i + 1}
                </div>
                <span className={`text-[9px] uppercase tracking-wider mt-1 ${s === step ? "text-[#C9A84C]" : "text-neutral-600"}`}>
                  {s}
                </span>
              </div>
              {i < 2 && <div className="w-16 sm:w-24 h-[1px] bg-[#2a2a2a] mx-2 mb-4" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 xl:gap-12">
          {/* ── Forms ── */}
          <div>
            {/* INFORMATION */}
            {step === "information" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">
                  Contact &amp; Shipping Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">Email Address</label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com"
                      className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">First Name</label>
                      <input type="text" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="Jay"
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">Last Name</label>
                      <input type="text" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="Carter"
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">Street Address</label>
                    <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="1 Marcy Ave"
                      className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">City</label>
                      <input type="text" value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="Brooklyn"
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">State / Region</label>
                      <input type="text" value={form.state} onChange={(e) => update("state", e.target.value)} placeholder="NY"
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">ZIP / Postcode</label>
                      <input type="text" value={form.zip} onChange={(e) => update("zip", e.target.value)} placeholder="11206"
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">Phone (optional)</label>
                    <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors" />
                  </div>
                </div>
                <button onClick={() => setStep("shipping")} className="btn-gold w-full py-4 text-sm rounded-sm mt-8">
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* SHIPPING */}
            {step === "shipping" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">Shipping Method</h2>
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-4 mb-6 text-sm">
                  <div className="flex justify-between items-start">
                    <div className="text-neutral-400 space-y-0.5">
                      <p>{form.email}</p>
                      <p>
                        {form.firstName} {form.lastName}
                        {form.address && ` · ${form.address}`}
                        {form.city && `, ${form.city}`}
                        {form.state && ` ${form.state}`}
                        {form.zip && ` ${form.zip}`}
                      </p>
                    </div>
                    <button onClick={() => setStep("information")} className="text-[11px] text-[#C9A84C] hover:underline uppercase tracking-wider ml-4 flex-shrink-0">Edit</button>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { id: "standard", label: "Standard Shipping", sub: "5–7 business days", price: subtotal >= 150 ? "FREE" : "€12.00" },
                    { id: "express", label: "Express Shipping", sub: "2–3 business days", price: "€24.00" },
                    { id: "overnight", label: "Overnight Shipping", sub: "Next business day", price: "€40.00" },
                  ].map((method) => (
                    <label key={method.id}
                      className={`flex items-center gap-4 border rounded-sm p-4 cursor-pointer transition-all ${form.shippingMethod === method.id ? "border-[#C9A84C] bg-[#C9A84C]/5" : "border-[#1a1a1a] hover:border-[#2a2a2a]"}`}>
                      <input type="radio" name="shipping" value={method.id} checked={form.shippingMethod === method.id} onChange={() => update("shippingMethod", method.id)} className="accent-[#C9A84C]" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{method.label}</p>
                        <p className="text-[11px] text-neutral-600 mt-0.5">{method.sub}</p>
                      </div>
                      <span className={`text-sm font-bold ${method.price === "FREE" ? "text-green-400" : "text-neutral-300"}`}>{method.price}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep("information")} className="btn-outline-gold px-6 py-4 text-xs rounded-sm">Back</button>
                  <button onClick={() => setStep("payment")} className="btn-gold flex-1 py-4 text-sm rounded-sm">Continue to Payment</button>
                </div>
              </div>
            )}

            {/* PAYMENT */}
            {step === "payment" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">Payment</h2>
                {/* Recap */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-4 mb-6 text-sm space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Contact</span>
                    <span className="text-neutral-300">{form.email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Ship to</span>
                    <span className="text-neutral-300 text-right ml-4 truncate max-w-[220px]">
                      {[form.firstName, form.lastName].filter(Boolean).join(" ")}
                      {form.city && `, ${form.city}`}
                      {form.state && ` ${form.state}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Shipping</span>
                    <span className="text-neutral-300">
                      {form.shippingMethod === "standard" ? (subtotal >= 150 ? "Free Standard" : "Standard (5–7 days)") : form.shippingMethod === "express" ? "Express (2–3 days)" : "Overnight"}
                    </span>
                  </div>
                  <button onClick={() => setStep("shipping")} className="text-[11px] text-[#C9A84C] hover:underline uppercase tracking-wider mt-1">Edit</button>
                </div>

                {/* Stripe box */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6 mb-6">
                  <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-5">
                    <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secure payment via Stripe — your card details never touch our servers
                  </div>
                  <div className="text-center py-4">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-[#635BFF] rounded flex items-center justify-center">
                        <span className="text-white font-black text-sm italic">S</span>
                      </div>
                      <span className="text-neutral-300 text-lg font-semibold tracking-tight">stripe</span>
                    </div>
                    <p className="text-neutral-600 text-xs">
                      You&apos;ll be redirected to Stripe&apos;s secure checkout page
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-4">
                    {["VISA", "MC", "AMEX", "iDEAL", "SEPA"].map((p) => (
                      <span key={p} className="text-[8px] font-black text-neutral-600 border border-[#2a2a2a] px-1.5 py-0.5 rounded">{p}</span>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/30 rounded-sm px-4 py-3 mb-4">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep("shipping")} disabled={loading}
                    className="btn-outline-gold px-6 py-4 text-xs rounded-sm disabled:opacity-50">Back</button>
                  <button onClick={handleStripeCheckout} disabled={loading}
                    className={`btn-gold flex-1 py-4 text-sm rounded-sm flex items-center justify-center gap-2 ${loading ? "opacity-80 cursor-wait" : ""}`}>
                    {loading ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Redirecting to Stripe…
                      </>
                    ) : (
                      <>Pay Securely — €{total.toFixed(2)}</>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Order summary sidebar ── */}
          <div>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6 sticky top-24">
              <h2 className="text-sm font-black uppercase tracking-[0.15em] mb-5">Order Summary</h2>
              <div className="h-[1px] bg-gradient-to-r from-[#C9A84C]/40 to-transparent mb-5" />

              {/* Items */}
              <ul className="space-y-4 mb-5">
                {state.items.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-[#111111] border border-[#1a1a1a] rounded-sm flex items-center justify-center">
                        <span className="text-[7px] text-neutral-700 uppercase text-center leading-relaxed px-1">{item.product.category}</span>
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#2a2a2a] rounded-full text-[9px] font-black flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs leading-tight truncate">{item.product.name}</p>
                      <p className="text-[10px] text-neutral-600 mt-0.5">{item.size} · {item.color}</p>
                    </div>
                    <p className="text-xs font-bold text-[#C9A84C] flex-shrink-0">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Promo code input */}
              <div className="border-t border-[#1a1a1a] pt-4 mb-4">
                {promoCode ? (
                  /* Applied promo */
                  <div className="flex items-center justify-between bg-green-900/20 border border-green-500/30 rounded-sm px-3 py-2.5">
                    <div>
                      <p className="text-xs font-bold text-green-400 uppercase tracking-wider">{promoCode}</p>
                      <p className="text-[10px] text-green-400/70 mt-0.5">{promoLabel}</p>
                    </div>
                    <button onClick={removePromo} className="text-green-400/50 hover:text-red-400 transition-colors ml-2 flex-shrink-0" aria-label="Remove promo">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* Promo input */
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-600 mb-2">
                      Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
                        onChange={(e) => { setPromoInput(e.target.value.toUpperCase()); setPromoError(null); }}
                        onKeyDown={(e) => e.key === "Enter" && applyPromo()}
                        placeholder="TIKTOK10"
                        className="flex-1 bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-3 py-2.5 text-xs rounded-sm outline-none transition-colors uppercase font-mono tracking-wider"
                      />
                      <button
                        onClick={applyPromo}
                        className="btn-outline-gold px-4 py-2.5 text-xs rounded-sm whitespace-nowrap"
                      >
                        Apply
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-red-400 text-[11px] mt-1.5">{promoError}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="border-t border-[#1a1a1a] pt-4 space-y-2.5">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Subtotal</span>
                  <span className="text-neutral-300">€{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">Discount ({discountPercent}% off)</span>
                    <span className="text-green-400 font-bold">−€{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : "text-neutral-300"}>
                    {shipping === 0 ? "FREE" : `€${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>
              <div className="border-t border-[#1a1a1a] mt-4 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold uppercase tracking-wider">Total</span>
                <span className="text-xl font-black text-[#C9A84C]">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
