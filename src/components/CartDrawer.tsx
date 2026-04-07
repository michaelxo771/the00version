"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartDrawer() {
  const { state, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <>
      {/* Backdrop */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#0d0d0d] border-l border-[#1a1a1a] z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          state.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1a1a1a]">
          <div>
            <h2 className="text-base font-bold uppercase tracking-[0.15em]">
              Your Cart
            </h2>
            {totalItems > 0 && (
              <p className="text-[11px] text-neutral-500 mt-0.5">
                {totalItems} item{totalItems !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-neutral-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Gold stripe */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent opacity-40" />

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {state.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 border border-[#2a2a2a] rounded-full flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-neutral-500 text-sm mb-1">Your cart is empty</p>
              <p className="text-neutral-600 text-xs">Add something legendary</p>
              <button
                onClick={closeCart}
                className="mt-6 btn-outline-gold px-6 py-2.5 text-xs rounded"
              >
                Browse Collection
              </button>
            </div>
          ) : (
            <ul className="space-y-5">
              {state.items.map((item, idx) => (
                <li key={idx} className="flex gap-4 py-4 border-b border-[#1a1a1a]">
                  {/* Product image placeholder */}
                  <div className="w-20 h-20 bg-[#1a1a1a] rounded flex-shrink-0 flex items-center justify-center">
                    <span className="text-[8px] text-neutral-600 uppercase tracking-wider text-center leading-relaxed px-1">
                      {item.product.name.split(" ").slice(0, 2).join("\n")}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-sm font-semibold leading-tight truncate pr-2">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeItem(item.product.id, item.size, item.color)}
                        className="text-neutral-600 hover:text-red-400 transition-colors flex-shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      {item.size} · {item.color}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      {/* Qty controls */}
                      <div className="flex items-center border border-[#2a2a2a] rounded">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                          className="w-7 h-7 text-neutral-400 hover:text-white transition-colors flex items-center justify-center text-sm"
                        >
                          −
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center text-sm font-medium border-x border-[#2a2a2a]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                          className="w-7 h-7 text-neutral-400 hover:text-white transition-colors flex items-center justify-center text-sm"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-bold text-[#C9A84C]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t border-[#1a1a1a] px-6 py-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-400 uppercase tracking-wider">Subtotal</span>
              <span className="text-lg font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-[11px] text-neutral-600">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full btn-gold px-6 py-4 text-center text-sm rounded"
            >
              Checkout — ${subtotal.toFixed(2)}
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full btn-outline-gold px-6 py-3 text-center text-xs rounded"
            >
              View Cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
