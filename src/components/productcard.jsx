import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const {
    id,
    title,
    price,
    originalPrice,
    fitTag, // e.g. "OVERSIZED FIT" ya "RELAXED FIT"
    isSoldOut,
    sizes, // e.g. ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    availableSizes, // e.g. ['M', 'L', 'XL', 'XXL']
    image,
    slug,
  } = product;

  return (
    <div className="group relative w-full flex flex-col bg-transparent text-white overflow-hidden">
      {/* 1. Image Container */}
      <Link href={`/product/${slug}`} className="relative w-full aspect-[3/4] bg-zinc-900 overflow-hidden block">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges (Fit Tag & Sold Out) */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-center text-[10px] sm:text-xs font-bold tracking-wider z-10 pointer-events-none">
          {/* Sold Out Badge */}
          {isSoldOut ? (
            <span className="bg-black/80 text-zinc-300 px-2 py-0.5 uppercase tracking-widest">
              SOLD OUT
            </span>
          ) : (
            <div />
          )}

          {/* Fit Type Badge */}
          {fitTag && (
            <span className="bg-black/60 backdrop-blur-sm text-zinc-200 px-2 py-0.5 uppercase tracking-widest ml-auto">
              {fitTag}
            </span>
          )}
        </div>
      </Link>

      {/* 2. Product Details */}
      <div className="pt-3 pb-2 flex flex-col space-y-1">
        {/* Title */}
        <Link href={`/product/${slug}`}>
          <h3 className="text-xs sm:text-sm font-semibold tracking-wide text-zinc-200 uppercase truncate group-hover:text-white transition-colors">
            {title}
          </h3>
        </Link>

        {/* Price & Original Price */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <span className="font-bold text-white">₹ {price.toLocaleString('en-IN')}.00</span>
          {originalPrice && (
            <span className="text-zinc-500 line-through text-[11px] sm:text-xs">
              ₹ {originalPrice.toLocaleString('en-IN')}.00
            </span>
          )}
        </div>

        {/* Sizes List */}
        {sizes && (
          <div className="flex items-center space-x-1.5 pt-1 text-[10px] sm:text-xs tracking-wider">
            {sizes.map((size) => {
              const isAvailable = availableSizes?.includes(size);
              return (
                <span
                  key={size}
                  className={`font-medium ${
                    isAvailable
                      ? 'text-zinc-300'
                      : 'text-zinc-600 line-through decoration-zinc-600'
                  }`}
                >
                  {size}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;