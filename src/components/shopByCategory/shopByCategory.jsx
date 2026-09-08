"use client";
import React, { useState, useMemo } from "react";
import ProductCard from "@/components/productcard";
import FilterSidebar from "./FilterSidebar";
import { SlidersHorizontal, X } from "lucide-react";

const ShopByCategory = () => {
  const initialProducts = [
    {
      id: 1,
      title: "THE GLORY ARC RELAXED FIT T-SHIRT",
      price: 1599,
      category: "T-Shirt",
      fitTag: "Relaxed Fit",
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
      category: "T-Shirt",
      fitTag: "Oversized Fit",
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
      category: "T-Shirt",
      fitTag: "Oversized Fit",
      isSoldOut: false,
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      availableSizes: ["L", "XL", "XXL"],
      image: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
      slug: "trinity-white-oversized",
    },
  ];

  const [filters, setFilters] = useState({
    sortBy: "recommended",
    category: [],
    fit: [],
    size: [],
    maxPrice: 5000,
    inStockOnly: false,
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((product) => {
        if (filters.category.length > 0 && !filters.category.includes(product.category)) return false;
        if (filters.fit.length > 0 && !filters.fit.includes(product.fitTag)) return false;
        if (filters.size.length > 0 && !filters.size.some((s) => product.availableSizes.includes(s))) return false;
        if (product.price > filters.maxPrice) return false;
        if (filters.inStockOnly && product.isSoldOut) return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === "price_asc") return a.price - b.price;
        if (filters.sortBy === "price_desc") return b.price - a.price;
        if (filters.sortBy === "alpha_asc") return a.title.localeCompare(b.title);
        if (filters.sortBy === "alpha_desc") return b.title.localeCompare(a.title);
        return 0;
      });
  }, [filters]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 md:py-8">
      
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">Shop By Category</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Showing {filteredProducts.length} of {initialProducts.length} products
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 bg-zinc-900 border border-zinc-700 px-4 py-2 rounded-lg text-xs font-semibold text-white hover:bg-zinc-800 transition"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
          Filters & Sort
        </button>
      </div>

      {/* Main Container */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block">
          <FilterSidebar onFilterChange={handleFilterChange} />
        </div>

        {/* MOBILE DRAWER SIDEBAR */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            
            {/* Sliding Drawer */}
            <div className="relative w-full max-w-xs bg-[#121214] h-full overflow-y-auto p-5 z-10 shadow-2xl ml-auto border-l border-zinc-800">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
                <h2 className="text-sm font-bold text-white uppercase">Filters & Sort</h2>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sidebar Component */}
              <FilterSidebar onFilterChange={handleFilterChange} />
            </div>
          </div>
        )}

        {/* MAIN PRODUCT GRID SECTION */}
        <main className="flex-1">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
              <p className="text-zinc-400 text-sm">No products match your selected filters.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default ShopByCategory;