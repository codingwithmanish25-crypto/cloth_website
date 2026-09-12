"use client";
import React, { useState, useEffect, useMemo } from "react";
import ProductCard from "@/components/productcard";
import FilterSidebar from "./FilterSidebar";
import { SlidersHorizontal, X } from "lucide-react";

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] w-full bg-zinc-800" />
    <div className="mt-3 h-3 w-4/5 bg-zinc-800" />
    <div className="mt-2 h-3 w-2/5 bg-zinc-800" />
    <div className="mt-2 h-2 w-3/5 bg-zinc-800" />
  </div>
);

const ProductSkeletonGrid = () => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 md:gap-6">
    {Array.from({ length: 8 }, (_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
);

const ShopByCategory = ({ initialCategory = "", initialCollection = "" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    sortBy: "recommended",
    category: initialCategory ? [initialCategory] : [],
    fit: [],
    size: [],
    maxPrice: 50000,
    inStockOnly: false,
  });

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/products");
        const data = await res.json();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (!product) return false;

        // Safe Category Resolution & Case Normalization
        const categorySlug = String(
          typeof product.category === "object"
            ? product.category?.slug || ""
            : product.category || ""
        )
          .toLowerCase()
          .trim();

        if (filters.category && filters.category.length > 0) {
          const matchesCategory = filters.category.some((cat) => {
            const normalizedSelected = String(cat || "").toLowerCase().trim();
            return categorySlug === normalizedSelected;
          });
          if (!matchesCategory) return false;
        }

        if (
          initialCollection &&
          (!Array.isArray(product.collectionSlugs) ||
            !product.collectionSlugs.includes(initialCollection))
        ) {
          return false;
        }

        // Safe Fit Tag Check (Case-Insensitive)
        const productFit = (product.fitTag || product.fit || "")
          .toString()
          .toLowerCase()
          .trim();

        if (filters.fit && filters.fit.length > 0) {
          const matchesFit = filters.fit.some(
            (f) => f.toLowerCase().trim() === productFit
          );
          if (!matchesFit) return false;
        }

        // Safe Sizes Check (Case-Insensitive)
        const sizesList = (
          Array.isArray(product.availableSizes)
            ? product.availableSizes
            : Array.isArray(product.sizes)
            ? product.sizes
            : []
        ).map((s) => s.toString().toUpperCase().trim());

        if (filters.size && filters.size.length > 0) {
          const matchesSize = filters.size.some((s) =>
            sizesList.includes(s.toUpperCase().trim())
          );
          if (!matchesSize) return false;
        }

        // Safe Numeric Price Parse Check
        const numericPrice = Number(product.price) || 0;
        if (filters.maxPrice && numericPrice > filters.maxPrice) {
          return false;
        }

        // Stock Filter Check
        if (filters.inStockOnly && (product.isSoldOut || product.stock === 0)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;

        if (filters.sortBy === "price_asc") return priceA - priceB;
        if (filters.sortBy === "price_desc") return priceB - priceA;
        if (filters.sortBy === "alpha_asc")
          return (a.title || "").localeCompare(b.title || "");
        if (filters.sortBy === "alpha_desc")
          return (b.title || "").localeCompare(a.title || ""); // Fixed: Changed b.title to a.title comparison
        return 0;
      });
  }, [products, filters, initialCollection]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 md:py-8">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white uppercase tracking-wide">
            {initialCollection ? "Shop By Collection" : "Shop By Category"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Showing {filteredProducts.length} of {products.length} products
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
          <FilterSidebar
            onFilterChange={handleFilterChange}
            initialCategory={initialCategory}
          />
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
                <h2 className="text-sm font-bold text-white uppercase">
                  Filters & Sort
                </h2>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white bg-zinc-800/60"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterSidebar
                onFilterChange={handleFilterChange}
                initialCategory={initialCategory}
              />
            </div>
          </div>
        )}

        {/* MAIN PRODUCT GRID SECTION */}
        <main className="flex-1">
          {loading ? (
            <ProductSkeletonGrid />
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
              {filteredProducts.map((item, index) => (
                <ProductCard
                  key={item.id || item._id}
                  product={item}
                  priority={index === 0}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
              <p className="text-zinc-400 text-sm">
                No products match your selected filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopByCategory;