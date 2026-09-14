"use client";

import { useState } from "react";
import ProductCard from "@/components/productcard";

const RelatedProducts = ({
  products = [],
  categoryName = "Related Products",
  initialLimit = 5,
  showLoadMore = true,
}) => {
  const [visibleCount, setVisibleCount] = useState(initialLimit);
  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  if (!products.length) return null;

  return (
    <section className="mt-20 border-t border-zinc-800 pt-12">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            You may also like
          </p>
          <h2 className="mt-2 text-2xl font-bold uppercase tracking-wide text-white">
            More from {categoryName}
          </h2>
        </div>
        <span className="hidden text-xs text-zinc-500 sm:block">
          Explore more styles
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {visibleProducts.map((product, index) => (
          <ProductCard
            key={product.id || product.slug}
            product={product}
            priority={index === 0}
          />
        ))}
      </div>
      {showLoadMore && hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 5)}
            className="rounded-md border border-emerald-500/50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-400 transition-colors hover:bg-emerald-500 hover:text-black"
          >
            Load More Products
          </button>
        </div>
      )}
    </section>
  );
};

export default RelatedProducts;
