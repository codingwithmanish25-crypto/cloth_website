"use client";
import React from "react";
import Image from "next/image";
import { ChevronLeft, Trash2, Plus, Minus, Tag, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { isCartOpen, closeCart, cartItems, updateQuantity, removeFromCart } = useCart();

  if (!isCartOpen) return null;

  const completeYourLook = [
    {
      id: 101,
      title: "Red Printed Tee",
      price: 1599,
      image: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
    },
    {
      id: 102,
      title: "Wild Print Tee",
      price: 1599,
      image: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
    },
    {
      id: 103,
      title: "Ankle Socks Pack",
      price: 349,
      originalPrice: 599,
      image: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
    },
  ];

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const getOfferProgress = () => {
    if (totalItems >= 5) return 100;
    if (totalItems >= 3) return 66;
    if (totalItems >= 2) return 33;
    return (totalItems / 2) * 33;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <aside className="relative w-full max-w-[420px] bg-zinc-950 text-white h-full flex flex-col z-10 shadow-2xl border-l border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <button
            onClick={closeCart}
            className="p-1 hover:bg-zinc-800 rounded-full transition text-zinc-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white tracking-wide uppercase">
            Your Bag ({totalItems})
          </h2>
          <div className="w-6" />
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-5">
          {/* Progress Bar */}
          <div className="px-5 pt-4 pb-2 bg-zinc-900 border-b border-zinc-800">
            <div className="relative w-full h-1.5 bg-zinc-800 rounded-full mb-3">
              <div
                className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-300"
                style={{ width: `${getOfferProgress()}%` }}
              />
              <div className="absolute -top-1 left-[33%] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-zinc-950 border-2 border-orange-500" />
              <div className="absolute -top-1 left-[66%] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-zinc-950 border-2 border-orange-500" />
              <div className="absolute -top-1 left-[100%] -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-zinc-950 border-2 border-orange-500" />
            </div>

            <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
              <div className="text-center">
                <span>Buy 2</span>
                <p className="text-[10px] text-zinc-500">10% Off</p>
              </div>
              <div className="text-center">
                <span>Buy 3</span>
                <p className="text-[10px] text-zinc-500">15% Off</p>
              </div>
              <div className="text-center">
                <span>Buy 5</span>
                <p className="text-[10px] text-zinc-500">20% Off</p>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="px-4 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.cartItemId || item.id} className="flex gap-3 pb-4 border-b border-zinc-800">
                  <div className="relative w-20 h-24 bg-zinc-900 rounded overflow-hidden shrink-0">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-semibold text-zinc-100 line-clamp-1">
                          {item.title}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.cartItemId || item.id)}
                          className="text-zinc-500 hover:text-red-400 p-0.5 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Size: {item.size}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-700 rounded px-1 py-0.5 bg-zinc-900">
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.id, -1)}
                          className="px-1.5 py-0.5 text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.id, 1)}
                          className="px-1.5 py-0.5 text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-white">
                        ₹ {(item.price * item.quantity).toLocaleString("en-IN")}.00
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-zinc-500 text-xs">
                Your bag is empty.
              </div>
            )}
          </div>

          {/* Coupons Bar */}
          <div className="px-4">
            <button className="w-full flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition text-xs font-medium text-zinc-200">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-500" />
                <span>Apply Coupons</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>
          </div>

          {/* Cross Sell Section */}
          <div className="px-4 pb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
              Complete Your Look
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {completeYourLook.map((prod) => (
                <div key={prod.id} className="border border-zinc-800 rounded p-1.5 bg-zinc-900">
                  <div className="relative w-full aspect-[3/4] bg-zinc-800 rounded overflow-hidden">
                    <Image src={prod.image} alt={prod.title} fill className="object-cover" />
                    <button className="absolute top-1 right-1 bg-orange-600 hover:bg-orange-500 text-white p-1 rounded-full shadow">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="mt-1.5 text-[10px]">
                    <p className="font-medium text-zinc-300 truncate">{prod.title}</p>
                    <div className="flex items-center gap-1 mt-0.5 font-bold text-white">
                      <span>₹ {prod.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-sm font-bold text-white">
              ₹ {subtotal.toLocaleString("en-IN")}.00
            </span>
          </div>
          <button className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold py-3.5 rounded uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition">
            <span>Proceed to Buy</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Cart;