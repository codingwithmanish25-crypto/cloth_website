"use client";

import React, { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/productcard";
import BlinkLoader from "@/components/BlinkLoader";

const PAGE_SIZE = 5;

const Sectionthird = () => {
  const [fitTags, setFitTags] = useState([]);
  const [fitTagsLoaded, setFitTagsLoaded] = useState(false);
  const [activeFit, setActiveFit] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const loadMoreControllerRef = useRef(null);

  useEffect(() => () => loadMoreControllerRef.current?.abort(), []);

  useEffect(() => {
    let cancelled = false;

    const loadFitTags = async () => {
      try {
        const response = await fetch("/api/products?fitTags=true");
        const data = await response.json();
        if (!response.ok || !Array.isArray(data))
          throw new Error("Failed to load fit types");
        if (cancelled) return;
        setFitTags(data);
        setActiveFit(data[0] || "");
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load homepage fit types:", error);
        }
      } finally {
        if (!cancelled) setFitTagsLoaded(true);
      }
    };

    loadFitTags();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!fitTagsLoaded) return;

    const controller = new AbortController();
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: "1",
          limit: String(PAGE_SIZE),
        });
        if (activeFit) params.set("fitTag", activeFit);
        const response = await fetch(`/api/products?${params}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (controller.signal.aborted) return;
        if (!response.ok) throw new Error("Failed to load fit products");
        setProducts(Array.isArray(data.products) ? data.products : []);
        setPage(1);
        setHasMore(Boolean(data.hasMore));
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Failed to load homepage products:", error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      controller.abort();
    };
  }, [activeFit, fitTagsLoaded]);

  const loadMore = async () => {
    const nextPage = page + 1;
    const controller = new AbortController();
    loadMoreControllerRef.current?.abort();
    loadMoreControllerRef.current = controller;
    setLoadingMore(true);
    try {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(PAGE_SIZE),
      });
      if (activeFit) params.set("fitTag", activeFit);
      const response = await fetch(`/api/products?${params}`, {
        signal: controller.signal,
      });
      const data = await response.json();
      if (controller.signal.aborted) return;
      if (!response.ok) throw new Error("Failed to load more products");
      setProducts((current) => [...current, ...(data.products || [])]);
      setPage(nextPage);
      setHasMore(Boolean(data.hasMore));
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("Failed to load more homepage products:", error);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingMore(false);
        loadMoreControllerRef.current = null;
      }
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center gap-3 overflow-x-auto border-b border-zinc-800 pb-6">
        {fitTags.map((fitTag) => (
          <button
            key={fitTag}
            type="button"
            onClick={() => setActiveFit(fitTag)}
            className={`whitespace-nowrap border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
              activeFit === fitTag
                ? "border-white bg-white text-black"
                : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-emerald-400"
            }`}
          >
            {fitTag}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-black uppercase tracking-widest text-zinc-100">
          Shop By Fit
        </h2>
      </div>

      {loading ? (
        <BlinkLoader label="Loading products..." className="min-h-64" />
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
        </>
      ) : (
        <p className="py-16 text-center text-sm text-zinc-500">
          No products found.
        </p>
      )}
    </section>
  );
};

export default Sectionthird;
