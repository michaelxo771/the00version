"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { state, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  const shipping = subtotal >= 150 ? 0 : 12;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#C9A84C] mb-2">Review</p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">Your Cart</h1>
          {totalItems > 0 && (
            <p className="text-neutral-500 text-sm mt-2">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
          )}
        </div>

        {state.items.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 border border-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-9 h-9 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-400 mb-2">Your cart is empty</h2>
            <p className="text-neutral-600 text-sm mb-8">Time to cop something legendary.</p>
            <Link href="/products" className="btn-gold px-10 py-4 text-sm rounded inline-block">
              Shop the Collection
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
            {/* Cart items */}
            <div className="lg:col-span-2">
              {/* Column headers */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto] gap-4 pb-4 border-b border-[#1a1a1a] text-[10px] uppercase tracking-[0.2em] text-neutral-600">
                <span>Product</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Total</span>
              </div>

              <ul className="divide-y divide-[#1a1a1a]">
                {state.items.map((item, idx) => (
                  <li key={idx} className="py-6 grid sm:grid-cols-[1fr_auto_auto] gap-4 items-start sm:items-center">
                    {/* Product info */}
                    <div className="flex gap-4">
                      {/* Image placeholder */}
                      <Link
                        href={`/products/${item.product.id}`}
                        className="w-20 h-24 sm:w-24 sm:h-28 bg-[#111111] border border-[#1a1a1a] rounded-sm flex-shrink-0 flex items-center justify-center hover:border-[#C9A84C]/30 transition-colors"
                      >
                        <span className="text-[8px] text-neutral-600 uppercase tracking-wider text-center leading-relaxed px-2">
                          {item.product.name.split(" ").slice(0, 3).join("\n")}
                        </span>
                      </Link>
                      <div className="flex flex-col justify-between py-1">
                        <div>
                          <Link
                            href={`/products/${item.product.id}`}
                            className="text-sm font-bold hover:text-[#C9A84C] transition-colors leading-tight"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-[11px] text-neutral-600 mt-1">
                            {item.size} · {item.color}
                          </p>
                          <p className="text-sm font-bold text-[#C9A84C] mt-1">
                            €{item.product.price}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id, item.size, item.color)}
                          className="text-[10px] uppercase tracking-wider text-neutral-600 hover:text-red-400 transition-colors w-fit mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center border border-[#2a2a2a] rounded-sm w-fit">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                        className="w-9 h-9 text-neutral-400 hover:text-white transition-colors flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-9 h-9 flex items-center justify-center text-sm font-bold border-x border-[#2a2a2a]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                        className="w-9 h-9 text-neutral-400 hover:text-white transition-colors flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right">
                      <span className="text-sm font-black text-neutral-100">
                        €{(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Continue shopping */}
              <div className="pt-6">
                <Link
                  href="/products"
                  className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-neutral-500 hover:text-[#C9A84C] transition-colors w-fit"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-sm p-6 sticky top-24">
                <h2 className="text-base font-black uppercase tracking-[0.15em] mb-6">
                  Order Summary
                </h2>

                {/* Gold divider */}
                <div className="h-[1px] bg-gradient-to-r from-[#C9A84C]/40 to-transparent mb-6" />

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-neutral-400">
                    <span>Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                    <span className="text-neutral-200">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-400" : "text-neutral-200"}>
                      {shipping === 0 ? "FREE" : `€${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {subtotal < 150 && (
                    <div className="text-[11px] text-neutral-600 bg-[#111111] rounded px-3 py-2">
                      Add €{(150 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  )}
                </div>

                <div className="border-t border-[#1a1a1a] mt-5 pt-5">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-bold uppercase tracking-wider">Total</span>
                    <span className="text-2xl font-black text-[#C9A84C]">€{total.toFixed(2)}</span>
                  </div>
                  <p className="text-[10px] text-neutral-600 mt-1">EUR · All taxes included</p>
                </div>

                <Link
                  href="/checkout"
                  className="btn-gold w-full block text-center py-4 text-sm rounded-sm mt-6"
                >
                  Proceed to Checkout
                </Link>

                {/* Payment icons */}
                <div className="mt-5 flex items-center justify-center gap-3">
                  {["VISA", "MC", "AMEX", "PayPal"].map((p) => (
                    <span
                      key={p}
                      className="text-[8px] font-black text-neutral-600 border border-[#2a2a2a] px-1.5 py-0.5 rounded"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
