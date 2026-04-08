"use client";

import { useState } from "react";

type OrderStatus = "confirmed" | "processing" | "shipped" | "delivered";

const STATUS_STEPS: { key: OrderStatus; label: string; description: string }[] = [
  { key: "confirmed", label: "Order Confirmed", description: "Your order has been received and payment confirmed." },
  { key: "processing", label: "Processing", description: "We're picking, packing, and preparing your items." },
  { key: "shipped", label: "Shipped", description: "Your order is on its way with your chosen courier." },
  { key: "delivered", label: "Delivered", description: "Your order has been delivered. Enjoy!" },
];

type OrderResult = {
  orderNumber: string;
  status: OrderStatus;
  shippingMethod: string;
  estimatedDelivery: string;
  items: { name: string; quantity: number }[];
};

function getMockOrder(orderNumber: string, email: string): OrderResult | null {
  // Mock: any order number starting with #00S and valid email returns a result
  const upper = orderNumber.trim().toUpperCase().replace(/^#/, "");
  if (!upper.startsWith("00S") || upper.length < 6) return null;
  if (!email.includes("@")) return null;

  // Derive a fake status from the last character of the order number
  const lastChar = upper.slice(-1);
  const statusMap: Record<string, OrderStatus> = {
    "0": "delivered", "1": "delivered", "2": "shipped", "3": "shipped",
    "4": "processing", "5": "processing", "6": "confirmed", "7": "confirmed",
    "8": "processing", "9": "shipped", A: "shipped", B: "delivered",
    C: "confirmed", D: "processing", E: "shipped", F: "delivered",
  };
  const status: OrderStatus = statusMap[lastChar] ?? "processing";

  const today = new Date();
  today.setDate(today.getDate() + 4);
  const estimated = today.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  return {
    orderNumber: `#${upper}`,
    status,
    shippingMethod: "Standard Shipping (5–7 days)",
    estimatedDelivery: estimated,
    items: [
      { name: "OG Heavyweight Hoodie", quantity: 1 },
      { name: "Era Snapback Cap", quantity: 1 },
    ],
  };
}

export default function TrackOrderForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<OrderResult | null>(null);
  const [notFound, setNotFound] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNotFound(false);
    setResult(null);
    const found = getMockOrder(orderNumber, email);
    if (found) {
      setResult(found);
    } else {
      setNotFound(true);
    }
  }

  const currentStepIndex = result ? STATUS_STEPS.findIndex((s) => s.key === result.status) : -1;

  return (
    <div>
      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6 sm:p-8 mb-6"
        aria-label="Track order form"
      >
        <div className="space-y-5">
          <div>
            <label htmlFor="orderNumber" className="block text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Order Number
            </label>
            <input
              id="orderNumber"
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="#00S123456"
              required
              aria-required="true"
              className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 text-sm px-4 py-3 rounded-sm outline-none transition-colors"
            />
            <p className="text-[10px] text-neutral-600 mt-1">Found in your order confirmation email</p>
          </div>
          <div>
            <label htmlFor="trackEmail" className="block text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-2">
              Email Address
            </label>
            <input
              id="trackEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              aria-required="true"
              className="w-full bg-[#111111] border border-[#2a2a2a] focus:border-[#C9A84C] text-neutral-200 placeholder-neutral-700 text-sm px-4 py-3 rounded-sm outline-none transition-colors"
            />
          </div>
        </div>
        <button type="submit" className="btn-gold w-full py-3.5 text-sm rounded-sm mt-6 font-bold uppercase tracking-[0.1em]">
          Track Order
        </button>
      </form>

      {/* Not found */}
      {notFound && (
        <div className="bg-red-600/10 border border-red-600/30 rounded-sm p-5 text-center" role="alert">
          <p className="text-red-400 font-semibold text-sm mb-1">Order not found</p>
          <p className="text-neutral-500 text-xs">
            Please check your order number (format: #00SXXXXXX) and email address.
            Order numbers are sent in your confirmation email.
          </p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-6" aria-live="polite">
          {/* Order info */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] mb-1">Order</p>
                <p className="text-lg font-black">{result.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-1">Est. Delivery</p>
                <p className="text-sm font-semibold text-neutral-200">{result.estimatedDelivery}</p>
              </div>
            </div>
            <div className="h-[1px] bg-[#1a1a1a] mb-4" />
            <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-500 mb-2">Items</p>
            {result.items.map((item) => (
              <div key={item.name} className="flex justify-between text-sm text-neutral-400 py-1">
                <span>{item.name}</span>
                <span>×{item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Status timeline */}
          <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#C9A84C] mb-6">Order Status</p>
            <ol className="relative" aria-label="Order status timeline">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const isLast = idx === STATUS_STEPS.length - 1;
                return (
                  <li key={step.key} className="flex gap-4 pb-6 last:pb-0 relative">
                    {/* Connector line */}
                    {!isLast && (
                      <div
                        className={`absolute left-[14px] top-7 w-[1px] h-full -mb-1 ${
                          idx < currentStepIndex ? "bg-[#C9A84C]" : "bg-[#1a1a1a]"
                        }`}
                        aria-hidden="true"
                      />
                    )}
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center z-10 ${
                        isCurrent
                          ? "border-[#C9A84C] bg-[#C9A84C]"
                          : isCompleted
                          ? "border-[#C9A84C] bg-[#C9A84C]/20"
                          : "border-[#2a2a2a] bg-[#0d0d0d]"
                      }`}
                      aria-label={isCompleted ? "Completed" : "Pending"}
                    >
                      {isCompleted ? (
                        <svg className={`w-3.5 h-3.5 ${isCurrent ? "text-[#080808]" : "text-[#C9A84C]"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#2a2a2a]" aria-hidden="true" />
                      )}
                    </div>
                    {/* Text */}
                    <div>
                      <p className={`text-sm font-bold uppercase tracking-wide ${isCurrent ? "text-[#C9A84C]" : isCompleted ? "text-neutral-200" : "text-neutral-600"}`}>
                        {step.label}
                        {isCurrent && <span className="ml-2 text-[10px] bg-[#C9A84C]/20 text-[#C9A84C] px-2 py-0.5 rounded-sm uppercase tracking-wider">Current</span>}
                      </p>
                      <p className={`text-xs mt-0.5 ${isCompleted ? "text-neutral-500" : "text-neutral-700"}`}>
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="text-center text-xs text-neutral-600">
            Questions? Email us at{" "}
            <a href="mailto:support@the00sversion.com" className="text-[#C9A84C] hover:underline">
              support@the00sversion.com
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
