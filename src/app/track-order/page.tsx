import type { Metadata } from "next";
import TrackOrderForm from "./TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Your Order — The 00s Version",
  description: "Enter your order number and email to track your order status.",
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Header */}
      <div className="relative text-center mb-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,168,76,0.05)_0%,_transparent_60%)]" />
        <div className="relative px-4">
          <p className="text-[11px] uppercase tracking-[0.4em] text-[#C9A84C] mb-3">Shipping</p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
            Track Your Order
          </h1>
          <p className="text-neutral-500 text-sm mt-4 max-w-md mx-auto">
            Enter your order number and email address to see your order status.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <TrackOrderForm />
      </div>
    </div>
  );
}
