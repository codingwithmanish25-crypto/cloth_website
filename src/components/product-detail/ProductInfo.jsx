'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from "@/context/CartContext";

const ProductInfo = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const { addToCart } = useCart();
  const isSoldOut = Boolean(product?.isSoldOut);
  const [coupons, setCoupons] = useState([]);
  const [copiedCode, setCopiedCode] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/coupons")
      .then((response) => response.json())
      .then((data) => {
        if (!cancelled) setCoupons(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setCoupons([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const copyCoupon = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(""), 1800);
  };

  const handleAddToCart = () => {
    if (product && !isSoldOut) {
      addToCart(product, selectedSize);
    }
  };

  const enteredPrice = Number(product?.price) || 0;
  const enteredOriginalPrice = Number(product?.originalPrice) || 0;
  const salePrice = enteredOriginalPrice > 0
    ? Math.min(enteredPrice, enteredOriginalPrice)
    : enteredPrice;
  const originalPrice = enteredOriginalPrice > 0
    ? Math.max(enteredPrice, enteredOriginalPrice)
    : 0;

  return (
    <div className="space-y-6 lg:sticky lg:top-8 h-fit">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-white">{product.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-2xl font-bold text-white">₹ {salePrice.toLocaleString('en-IN')}.00</span>
          {originalPrice > salePrice && (
            <span className="text-zinc-500 line-through text-base">
              ₹ {originalPrice.toLocaleString('en-IN')}.00
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-400 mt-1">Inclusive of all taxes.</p>
      </div>

      {/* Size Selector */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-zinc-300">Select Size</span>
          <button className="text-xs underline text-zinc-400 hover:text-white transition">Size chart</button>
        </div>

        <div className="grid grid-cols-6 gap-2">
          {product.sizes?.map((size) => (
            <button
              key={size}
              type="button"
              disabled={isSoldOut}
              onClick={() => setSelectedSize(size)}
              className={`h-11 rounded font-semibold text-xs border transition ${
                selectedSize === size
                  ? 'border-orange-500 text-orange-500 bg-orange-500/10'
                  : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
              } ${isSoldOut ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add To Cart */}
      <button
        type="button"
        disabled={isSoldOut}
        onClick={handleAddToCart}
        className={`w-full font-bold py-4 rounded transition uppercase tracking-wider text-sm ${
          isSoldOut
            ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
            : 'bg-orange-600 hover:bg-orange-500 text-black'
        }`}
      >
        {isSoldOut ? 'Sold Out' : 'Add To Cart'}
      </button>

      {/* Returns Badge */}
      <div className="bg-zinc-900 border border-zinc-800 rounded p-3 text-center text-xs text-emerald-400 font-medium">
        ✓ 7 Days easy exchange & return
      </div>

      {/* Offers Box */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Available Offers</span>
        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="flex items-center justify-between gap-3 rounded border border-dashed border-orange-500/50 bg-orange-500/5 p-3 text-xs">
                <div className="min-w-0">
                  <p className="font-bold text-white">
                    {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </p>
                  <p className="truncate text-[10px] text-zinc-400">{coupon.description || "Limited time offer"}</p>
                  {coupon.minOrderValue > 0 && <p className="text-[10px] text-zinc-500">Min order ₹{coupon.minOrderValue}</p>}
                  <p className="text-[10px] text-orange-400">Valid till {new Date(coupon.expiresAt).toLocaleDateString("en-IN")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => copyCoupon(coupon.code)}
                  className="shrink-0 rounded bg-orange-500 px-2 py-1 text-[10px] font-bold uppercase text-black"
                >
                  {copiedCode === coupon.code ? "Copied" : coupon.code}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-500">No active coupons right now.</p>
        )}
      </div>

      {/* Description */}
      <div className="border-t border-zinc-800 pt-4 space-y-2">
        <h3 className="text-sm font-semibold uppercase text-zinc-200">About The Product</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductInfo;