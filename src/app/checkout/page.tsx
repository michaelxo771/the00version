"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

type Step = "information" | "shipping" | "payment" | "confirmed";

export default function CheckoutPage() {
  const { state, subtotal, clearCart } = useCart();
  const [step, setStep] = useState<Step>("information");

  const shipping = subtotal >= 150 ? 0 : 12;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
    phone: "",
    shippingMethod: "standard",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    setStep("confirmed");
    clearCart();
  }

  if (step === "confirmed") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-20">
        <div className="max-w-md w-full text-center">
          {/* Success icon */}
          <div className="w-20 h-20 rounded-full border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-3">
            Order Confirmed
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">
            You&apos;re All Set
          </h1>
          <p className="text-neutral-400 text-sm leading-relaxed mb-2">
            Thanks for your order, {form.firstName || "legend"}.
          </p>
          <p className="text-neutral-600 text-sm mb-8">
            A confirmation email has been sent to{" "}
            <span className="text-neutral-400">{form.email || "your inbox"}</span>.
          </p>

          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-5 mb-8 text-left">
            <div className="h-[1px] bg-gradient-to-r from-[#C9A84C]/40 to-transparent mb-4" />
            <div className="flex justify-between text-sm text-neutral-400 mb-2">
              <span>Order number</span>
              <span className="text-neutral-200 font-mono">
                #00S{Math.floor(Math.random() * 90000 + 10000)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-neutral-400 mb-2">
              <span>Estimated delivery</span>
              <span className="text-neutral-200">5–7 business days</span>
            </div>
            <div className="flex justify-between text-sm text-neutral-400">
              <span>Total paid</span>
              <span className="text-[#C9A84C] font-black">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/" className="btn-gold px-8 py-3.5 text-sm rounded inline-block">
              Back to Home
            </Link>
            <Link href="/products" className="btn-outline-gold px-8 py-3.5 text-sm rounded inline-block">
              Keep Shopping
            </Link>
          </div>
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
        <div className="flex items-center justify-center gap-0 mb-10">
          {(["information", "shipping", "payment"] as const).map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-black transition-all ${
                    s === step
                      ? "border-[#C9A84C] bg-[#C9A84C] text-[#080808]"
                      : ["information", "shipping", "payment"].indexOf(s) <
                        ["information", "shipping", "payment"].indexOf(step)
                      ? "border-[#C9A84C] bg-[#C9A84C]/20 text-[#C9A84C]"
                      : "border-[#2a2a2a] text-neutral-600"
                  }`}
                >
                  {["information", "shipping", "payment"].indexOf(s) <
                  ["information", "shipping", "payment"].indexOf(step) ? (
                    "✓"
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-[9px] uppercase tracking-wider mt-1 ${
                    s === step ? "text-[#C9A84C]" : "text-neutral-600"
                  }`}
                >
                  {s}
                </span>
              </div>
              {i < 2 && (
                <div className="w-16 sm:w-24 h-[1px] bg-[#2a2a2a] mx-2 mb-4" />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 xl:gap-12">
          {/* Forms */}
          <div>
            {/* ─── INFORMATION ─── */}
            {step === "information" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">Contact & Shipping Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        placeholder="Jay"
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        onChange={(e) => update("lastName", e.target.value)}
                        placeholder="Carter"
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => update("address", e.target.value)}
                      placeholder="1 Marcy Ave"
                      className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-1">
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={form.city}
                        onChange={(e) => update("city", e.target.value)}
                        placeholder="Brooklyn"
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={form.state}
                        onChange={(e) => update("state", e.target.value)}
                        placeholder="NY"
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        ZIP
                      </label>
                      <input
                        type="text"
                        value={form.zip}
                        onChange={(e) => update("zip", e.target.value)}
                        placeholder="11206"
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setStep("shipping")}
                  className="btn-gold w-full py-4 text-sm rounded-sm mt-8"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* ─── SHIPPING ─── */}
            {step === "shipping" && (
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">Shipping Method</h2>

                {/* Delivery address recap */}
                <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-4 mb-6 text-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-neutral-400">{form.email}</p>
                      <p className="text-neutral-400 mt-1">
                        {form.firstName} {form.lastName} · {form.address}, {form.city} {form.state} {form.zip}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep("information")}
                      className="text-[11px] text-[#C9A84C] hover:underline uppercase tracking-wider"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { id: "standard", label: "Standard Shipping", sub: "5–7 business days", price: subtotal >= 150 ? "FREE" : "$12.00" },
                    { id: "express", label: "Express Shipping", sub: "2–3 business days", price: "$24.00" },
                    { id: "overnight", label: "Overnight Shipping", sub: "Next business day", price: "$40.00" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 border rounded-sm p-4 cursor-pointer transition-all ${
                        form.shippingMethod === method.id
                          ? "border-[#C9A84C] bg-[#C9A84C]/5"
                          : "border-[#1a1a1a] hover:border-[#2a2a2a]"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={form.shippingMethod === method.id}
                        onChange={() => update("shippingMethod", method.id)}
                        className="accent-[#C9A84C]"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{method.label}</p>
                        <p className="text-[11px] text-neutral-600 mt-0.5">{method.sub}</p>
                      </div>
                      <span className={`text-sm font-bold ${method.price === "FREE" ? "text-green-400" : "text-neutral-300"}`}>
                        {method.price}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setStep("information")}
                    className="btn-outline-gold px-6 py-4 text-xs rounded-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("payment")}
                    className="btn-gold flex-1 py-4 text-sm rounded-sm"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* ─── PAYMENT ─── */}
            {step === "payment" && (
              <form onSubmit={handlePlaceOrder}>
                <h2 className="text-xl font-black uppercase tracking-tight mb-6">Payment</h2>

                {/* Security badge */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-600 mb-6 bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm px-4 py-3">
                  <svg className="w-3.5 h-3.5 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  All transactions are secure and encrypted
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={form.cardNumber}
                      onChange={(e) => update("cardNumber", e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors font-mono tracking-wider"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={form.cardName}
                      onChange={(e) => update("cardName", e.target.value)}
                      placeholder="JAY CARTER"
                      className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors uppercase"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={form.expiry}
                        onChange={(e) => update("expiry", e.target.value)}
                        placeholder="MM / YY"
                        maxLength={7}
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-[0.15em] text-neutral-500 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={form.cvv}
                        onChange={(e) => update("cvv", e.target.value)}
                        placeholder="• • •"
                        maxLength={4}
                        className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 px-4 py-3 text-sm rounded-sm outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Billing same as shipping */}
                <label className="flex items-center gap-3 mt-5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-[#C9A84C] w-4 h-4" />
                  <span className="text-sm text-neutral-400">Billing address same as shipping</span>
                </label>

                <div className="flex gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep("shipping")}
                    className="btn-outline-gold px-6 py-4 text-xs rounded-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn-gold flex-1 py-4 text-sm rounded-sm"
                  >
                    Place Order — ${total.toFixed(2)}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6 sticky top-24">
              <h2 className="text-sm font-black uppercase tracking-[0.15em] mb-5">
                Order Summary
              </h2>
              <div className="h-[1px] bg-gradient-to-r from-[#C9A84C]/40 to-transparent mb-5" />

              {/* Items */}
              <ul className="space-y-4 mb-5">
                {state.items.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-[#111111] border border-[#1a1a1a] rounded-sm flex items-center justify-center">
                        <span className="text-[7px] text-neutral-700 uppercase text-center leading-relaxed px-1">
                          {item.product.category}
                        </span>
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
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-[#1a1a1a] pt-4 space-y-2.5">
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Subtotal</span>
                  <span className="text-neutral-300">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-400" : "text-neutral-300"}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>
              <div className="border-t border-[#1a1a1a] mt-4 pt-4 flex justify-between items-baseline">
                <span className="text-sm font-bold uppercase tracking-wider">Total</span>
                <span className="text-xl font-black text-[#C9A84C]">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
