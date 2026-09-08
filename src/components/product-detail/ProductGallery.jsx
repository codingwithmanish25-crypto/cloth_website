import React from 'react';
import Image from 'next/image';

const ProductGallery = ({ images = [], title, fitTag }) => {
  return (
    <div className="flex flex-col gap-3">
      {images.map((imgSrc, idx) => (
        <div
          key={idx}
          className="relative w-full aspect-[3/4] bg-zinc-900 border border-zinc-800 overflow-hidden"
        >
          <Image
            src={imgSrc}
            alt={`${title} view ${idx + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
            priority={idx === 0}
          />
          
          {/* Fit Badge (Peheli Image par) */}
          {idx === 0 && fitTag && (
            <span className="absolute top-4 right-4 bg-black/80 text-zinc-200 text-xs px-3 py-1 font-bold tracking-widest uppercase">
              {fitTag}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductGallery;