'use client';

import React, { useState } from 'react';
import { useCart } from "@/context/CartContext";

const ProductInfo = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, selectedSize);
    }
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-8 h-fit">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide text-white">{product.title}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-2xl font-bold text-white">₹ {product.price?.toLocaleString('en-IN')}.00</span>
          {product.originalPrice && (
            <span className="text-zinc-500 line-through text-base">
              ₹ {product.originalPrice?.toLocaleString('en-IN')}.00
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
              onClick={() => setSelectedSize(size)}
              className={`h-11 rounded font-semibold text-xs border transition ${
                selectedSize === size
                  ? 'border-orange-500 text-orange-500 bg-orange-500/10'
                  : 'border-zinc-700 text-zinc-300 hover:border-zinc-500'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add To Cart */}
      <button 
        onClick={handleAddToCart}
        className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold py-4 rounded transition uppercase tracking-wider text-sm"
      >
        Add To Cart
      </button>

      {/* Returns Badge */}
      <div className="bg-zinc-900 border border-zinc-800 rounded p-3 text-center text-xs text-emerald-400 font-medium">
        ✓ 7 Days easy exchange & return
      </div>

      {/* Offers Box */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Available Offers</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="border border-dashed border-orange-500/50 bg-orange-500/5 rounded p-3 text-xs flex justify-between items-center">
            <div>
              <p className="font-bold text-white">Enjoy ₹100 off</p>
              <p className="text-[10px] text-zinc-400">orders above ₹999</p>
            </div>
            <span className="bg-orange-500 text-black text-[10px] font-bold px-2 py-1 rounded uppercase">INSTANT100</span>
          </div>
          
          <div className="border border-dashed border-orange-500/50 bg-orange-500/5 rounded p-3 text-xs flex justify-between items-center">
            <div>
              <p className="font-bold text-white">Buy 2 Get 10% OFF</p>
              <p className="text-[10px] text-zinc-400">auto applied</p>
            </div>
            <span className="bg-orange-500 text-black text-[10px] font-bold px-2 py-1 rounded uppercase">DOUBLEUP10</span>
          </div>
        </div>
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