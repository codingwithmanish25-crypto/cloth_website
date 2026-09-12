"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "@/components/productcard";

const PAGE_SIZE = 5;

const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-[3/4] w-full bg-zinc-800" />
    <div className="mt-3 h-3 w-4/5 bg-zinc-800" />
    <div className="mt-2 h-3 w-2/5 bg-zinc-800" />
    <div className="mt-2 h-2 w-3/5 bg-zinc-800" />
  </div>
);

const ProductSkeletonGrid = ({ count = PAGE_SIZE }) => (
  <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
    {Array.from({ length: count }, (_, index) => (
      <ProductSkeleton key={index} />
    ))}
  </div>
);

const Sectionthird = () => {
  const [fitTags, setFitTags] = useState([]);
  const [activeFit, setActiveFit] = useState("");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const loadFitTags = async () => {
      try {
        const response = await fetch("/api/products?fitTags=true");
        const data = await response.json();
        if (response.ok) {
          setFitTags(data);
          setActiveFit(data[0] || "");
        }
      } catch (error) {
        console.error("Failed to load homepage filters:", error);
      }
    };

    loadFitTags();
  }, []);

  useEffect(() => {
    if (!fitTags.length && activeFit !== "") return;

    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: "1", limit: String(PAGE_SIZE) });
        if (activeFit) params.set("fitTag", activeFit);
        const response = await fetch(`/api/products?${params}`);
        const data = await response.json();
        if (response.ok) {
          setProducts(data.products || []);
          setPage(1);
          setHasMore(Boolean(data.hasMore));
        }
      } catch (error) {
        console.error("Failed to load homepage products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [activeFit, fitTags.length]);

  const loadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams({ page: String(nextPage), limit: String(PAGE_SIZE) });
      if (activeFit) params.set("fitTag", activeFit);
      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      if (response.ok) {
        setProducts((current) => [...current, ...(data.products || [])]);
        setPage(nextPage);
        setHasMore(Boolean(data.hasMore));
      }
    } catch (error) {
      console.error("Failed to load more homepage products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 overflow-x-auto pb-6 border-b border-zinc-800 mb-8">
        {fitTags.map((fitTag) => (
          <button
            key={fitTag}
            type="button"
            onClick={() => setActiveFit(fitTag)}
            className={`whitespace-nowrap border px-4 py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 ${
              activeFit === fitTag
                ? "border-white bg-white text-black"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-emerald-400"
            }`}
          >
            {fitTag}
          </button>
        ))}
      </div>

      {loading ? (
        <ProductSkeletonGrid />
      ) : products.length ? (
        <>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard
                key={String(product.id)}
                product={product}
                priority={index === 0}
              />
            ))}
          </div>
          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="border border-zinc-700 px-6 py-3 text-xs font-bold uppercase tracking-widest text-zinc-200 transition hover:border-emerald-500 hover:text-emerald-400 disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
          {loadingMore && <div className="mt-8"><ProductSkeletonGrid /></div>}
        </>
      ) : (
        <p className="py-16 text-center text-sm text-zinc-500">No products found.</p>
      )}
    </section>
  );
};

export default Sectionthird;
