"use client";

import { MapPin, Truck, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Sectiontwo = () => {
  const [products, setProducts] = useState([]);

  // Image layout grid data array
  const fits = ["RELAXED FIT", "OVERSIZED FIT", "REGULAR FIT", "SLIM FIT"];

  useEffect(() => {
    let active = true;

    fetch("/api/products")
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to load fit products");
        const data = await response.json();
        if (active && Array.isArray(data)) setProducts(data);
      })
      .catch((error) => console.error("Failed to load fit products:", error));

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full bg-[#0a0a0a] text-white py-8">
      {/* 1. Top Stats / Features Bar */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-around items-center border-b border-zinc-800 pb-10 px-4 text-center gap-6">
        {/* Satisfied Customers */}
        <div className="flex flex-col items-center space-y-1">
          <Users className="w-6 h-6 text-zinc-300 stroke-[1.5]" />
          <p className="text-sm font-bold tracking-wide">1,70,000+</p>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">
            Satisfied Customers
          </p>
        </div>

        {/* Pincodes Reached */}
        <div className="flex flex-col items-center space-y-1">
          <MapPin className="w-6 h-6 text-zinc-300 stroke-[1.5]" />
          <p className="text-sm font-bold tracking-wide">5,820+</p>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">
            Pincodes Reached
          </p>
        </div>

        {/* Fast Delivery */}
        <div className="flex flex-col items-center space-y-1">
          <Truck className="w-6 h-6 text-zinc-300 stroke-[1.5]" />
          <p className="text-xs text-zinc-400 uppercase tracking-wider">
            Ships Within
          </p>
          <p className="text-sm font-bold tracking-wide">12 Hours</p>
        </div>
      </div>

      {/* 2. Shop By Category Title */}
      <div className="text-center pt-10 pb-6">
        <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-100">
          Shop By Fit
        </h2>
      </div>

      {/* 3. Fit Product Grid */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {fits.map((fit) => {
            const product = products.find(
              (entry) =>
                String(entry.fitTag || "")
                  .toLowerCase()
                  .trim() === fit.toLowerCase(),
            );
            const image = Array.isArray(product?.images)
              ? product.images[0]
              : product?.images;

            return (
              <Link
                key={fit}
                href={`/shop_by_category?fit=${encodeURIComponent(fit)}`}
                className="group relative h-[380px] w-full overflow-hidden bg-zinc-900 rounded-sm border border-zinc-800/50 block"
              >
                {image ? (
                  <Image
                    src={image}
                    alt={product?.title || fit}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 text-xs uppercase tracking-widest text-zinc-500">
                    No products
                  </div>
                )}

                {/* Bottom Gradient Overlay (Exact reference matching) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                {/* Title Text at Bottom Center */}
                <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                  <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-white drop-shadow-md">
                    {fit}
                  </h3>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-zinc-200 drop-shadow-md">
                    {product ? "1 Product" : "0 Products"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Sectiontwo;
