import Link from "next/link";
import React from "react";
import { WEBSITE_COLLECTIONS } from "@/lib/websiteCollections";

const ShopByCollectionPage = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-10 md:py-16">
      <div className="border-b border-zinc-800 pb-6 mb-8">
        <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
          FORTYEIGHT
        </p>
        <h1 className="mt-3 text-3xl md:text-5xl font-bold uppercase tracking-wide text-white">
          Collections
        </h1>
        <p className="mt-3 text-sm text-zinc-400">
          Explore the latest edits and everyday signatures.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {WEBSITE_COLLECTIONS.map(([collection, slug], index) => (
          <Link
            key={slug}
            href={`/shop_by_collection/${slug}`}
            className="group flex items-center justify-between border border-zinc-800 bg-zinc-950/60 px-5 py-6 transition-colors hover:border-emerald-500/60 hover:bg-zinc-900"
          >
            <span className="text-lg font-semibold uppercase tracking-wider text-zinc-100 group-hover:text-emerald-400">
              {collection}
            </span>
            <span className="text-xs text-zinc-500">0{index + 1}</span>
          </Link>
        ))}
      </div>
    </main>
  );
};

export default ShopByCollectionPage;
