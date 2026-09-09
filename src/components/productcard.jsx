"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const {
    title = "",
    price = 0,
    originalPrice,
    mrp,
    fitTag,
    isSoldOut = false,
    image,
    images,
    slug = "",
    id,
  } = product;

  // 1. Safe Image Extractor
  const getDisplayImage = () => {
    if (imageError) return "/placeholder.jpg";
    if (typeof image === "string" && image.trim() !== "") return image;
    if (Array.isArray(images) && images.length > 0) {
      const first = images[0];
      if (typeof first === "string" && first.trim() !== "") return first;
      if (typeof first === "object" && first?.url) return first.url;
    }
    if (typeof images === "string" && images.trim() !== "") {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch (e) {
        return images;
      }
    }
    return "/placeholder.jpg";
  };

  // 2. Safe Sizes Normalizer (Handles Array, JSON String, Comma-separated String)
  const parseSizes = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === "string") {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        // Handle comma-separated string e.g. "S, M, L, XL"
        return data.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    return [];
  };

  // Get Sizes from all possible DB keys
  const allPossibleSizes = [
    ...parseSizes(product.sizes),
    ...parseSizes(product.size),
    ...parseSizes(product.availableSizes),
    ...parseSizes(product.variants?.map((v) => v.size)),
  ];

  // Remove duplicates
  const displaySizes = Array.from(new Set(allPossibleSizes));

  // Handle Available vs Stock Sizes
  const availableList = parseSizes(product.availableSizes);
  const isSizeAvailable = (sz) => {
    if (availableList.length > 0) return availableList.includes(sz);
    return true; // Default to available if specific availability list isn't provided
  };

  const displayImage = getDisplayImage();
  const productLink = slug ? `/product/${slug}` : id ? `/product/${id}` : "#";
  const displayMRP = originalPrice || mrp;

  return (
    <div className="group relative w-full flex flex-col bg-transparent text-white overflow-hidden">
      {/* Dynamic Link & Image */}
      <Link href={productLink} className="relative w-full aspect-[3/4] bg-zinc-900 overflow-hidden block">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={title || "Product Image"}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
            onError={() => setImageError(true)}
            unoptimized={displayImage.startsWith("http")}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
            No Image
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-[10px] sm:text-xs font-bold tracking-wider z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="bg-black/80 text-zinc-300 px-2 py-0.5 uppercase tracking-widest">
              SOLD OUT
            </span>
          ) : (
            <div />
          )}

          {fitTag && (
            <span className="bg-black/60 backdrop-blur-sm text-zinc-200 px-2 py-0.5 uppercase tracking-widest ml-auto">
              {fitTag}
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="pt-3 pb-2 flex flex-col space-y-1">
        <Link href={productLink}>
          <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-200 uppercase truncate group-hover:text-white transition-colors">
            {title}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <span className="font-bold text-white">
            ₹ {Number(price).toLocaleString("en-IN")}.00
          </span>
          {displayMRP && Number(displayMRP) > Number(price) && (
            <span className="text-zinc-500 line-through text-[11px] sm:text-xs">
              ₹ {Number(displayMRP).toLocaleString("en-IN")}.00
            </span>
          )}
        </div>

        {/* Sizes Display Section */}
        {displaySizes.length > 0 ? (
          <div className="flex items-center space-x-2 pt-1.5 text-[10px] sm:text-xs tracking-wider">
            {displaySizes.map((sz) => {
              const available = isSizeAvailable(sz);
              return (
                <span
                  key={sz}
                  className={`font-semibold ${
                    available
                      ? "text-zinc-300"
                      : "text-zinc-600 line-through decoration-zinc-600"
                  }`}
                >
                  {sz}
                </span>
              );
            })}
          </div>
        ) : (
          /* Fallback size display if admin provides standard sizing */
          <div className="flex items-center space-x-2 pt-1.5 text-[10px] sm:text-xs tracking-wider text-zinc-400 font-medium">
            <span>S</span>
            <span>M</span>
            <span>L</span>
            <span>XL</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;