import React from "react";

const DetailBlock = ({ className = "" }) => (
  <div className={`animate-pulse rounded bg-zinc-800 ${className}`} />
);

export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-12">
        <div className="grid grid-cols-2 gap-3 lg:col-span-7">
          <DetailBlock className="aspect-[3/4]" />
          <DetailBlock className="aspect-[3/4]" />
          <DetailBlock className="aspect-[3/4]" />
          <DetailBlock className="aspect-[3/4]" />
        </div>

        <div className="space-y-5 lg:col-span-5">
          <DetailBlock className="h-8 w-4/5" />
          <DetailBlock className="h-7 w-2/5" />
          <DetailBlock className="h-4 w-1/3" />
          <div className="border-t border-zinc-800 pt-5">
            <DetailBlock className="mb-3 h-4 w-1/4" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }, (_, index) => (
                <DetailBlock key={index} className="h-11" />
              ))}
            </div>
          </div>
          <DetailBlock className="h-14 w-full" />
          <DetailBlock className="h-28 w-full" />
        </div>

        <div className="space-y-4 border-t border-zinc-800 pt-10 lg:col-span-12">
          <DetailBlock className="h-7 w-1/4" />
          <DetailBlock className="h-24 w-full" />
          <DetailBlock className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}