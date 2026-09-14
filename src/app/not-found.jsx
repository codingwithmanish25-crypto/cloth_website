import React from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { headers } from "next/headers";
import RelatedProducts from "@/components/product-detail/RelatedProducts";

async function getSuggestedProducts() {
  try {
    const requestHeaders = await headers();
    const host = requestHeaders.get("host");
    const protocol = requestHeaders.get("x-forwarded-proto") || "http";
    const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
    const baseUrl =
      configuredUrl && !configuredUrl.includes("localhost")
        ? configuredUrl
        : `${protocol}://${host}`;
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const products = await response.json();
    return Array.isArray(products)
      ? products
          .filter((product) => !product.isSoldOut && Number(product.stock) > 0)
          .slice(0, 3)
      : [];
  } catch (error) {
    console.error("Fetch 404 suggestions error:", error);
    return [];
  }
}

const notfound = async () => {
  const suggestedProducts = await getSuggestedProducts();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col justify-between pt-10 pb-16 px-4 md:px-8">
      {/* 1. Main Hero 404 Section */}
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center my-auto pt-8">
        {/* Subtle Tag */}
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-[#10b981] uppercase bg-[#10b981]/10 px-4 py-1.5 rounded-full border border-[#10b981]/20 mb-6">
          <ShoppingBag className="w-3.5 h-3.5" /> Out of Stock or Missing
        </span>

        {/* Big Stylized 404 Header */}
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-300 to-zinc-700 leading-none">
          404
        </h1>

        <h2 className="text-xl md:text-3xl font-bold uppercase tracking-wider mt-4">
          LOOKS LIKE THIS STYLE IS MISSING!
        </h2>

        {/* Updated Hindi text to English */}
        <p className="text-zinc-400 text-sm md:text-base max-w-lg mt-3 font-normal">
          The page you are looking for doesn't exist or has been moved. Don't
          worry, we have plenty of fresh casual collections waiting for you!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <Link
            href="/"
            className="px-6 py-3.5 bg-[#10b981] text-black font-bold text-xs uppercase tracking-wider rounded-md hover:bg-[#00ff87] transition-all flex items-center gap-2 shadow-lg shadow-[#10b981]/20 cursor-pointer"
          >
            Back to Home Page <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/shop_by_category"
            className="px-6 py-3.5 bg-zinc-900 border border-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-zinc-800 transition-all cursor-pointer"
          >
            Explore All Collections
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full mt-16">
        <RelatedProducts
          products={suggestedProducts}
          categoryName="Fresh Styles"
          initialLimit={3}
          showLoadMore={false}
        />
      </div>
    </div>
  );
};

export default notfound;
