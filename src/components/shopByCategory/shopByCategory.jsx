"use client";
import React, { useState } from "react";
import ProductCard from "@/components/productcard";
import FilterSidebar from "./FilterSidebar";

const ShopByCategory = () => {
  const productsData = [
    {
      id: 1,
      title: "THE GLORY ARC RELAXED FIT T-SHIRT",
      price: 1599,
      fitTag: "RELAXED FIT",
      isSoldOut: false,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      availableSizes: ["XS", "S"],
      image: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
      slug: "the-glory-arc-relaxed-fit",
    },
    {
      id: 2,
      title: "SKY WALKER NAVY OVERSIZED T-SHIRT",
      price: 1599,
      originalPrice: 1999,
      fitTag: "OVERSIZED FIT",
      isSoldOut: true,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      availableSizes: [],
      image: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
      slug: "sky-walker-navy-oversized",
    },
    {
      id: 3,
      title: "TRINITY WHITE OVERSIZED T-SHIRT",
      price: 1799,
      originalPrice: 2199,
      fitTag: "OVERSIZED FIT",
      isSoldOut: false,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      availableSizes: ["L", "XL", "XXL"],
      image: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
      slug: "trinity-white-oversized",
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      {/* Top Title & Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#27272a]">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-wide">Shop By Category</h1>
          <p className="text-xs text-gray-400 mt-1">Showing {productsData.length} products</p>
        </div>
      </div>

      {/* Main Container: Filter + Product Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ASIDE FILTER SIDEBAR */}
        <FilterSidebar />

        {/* MAIN PRODUCT GRID SECTION */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsData.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShopByCategory;