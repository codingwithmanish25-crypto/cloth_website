import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShoppingBag } from "lucide-react";

const notfound = () => {
  const casualCategories = [
    {
      title: "Oversized Tees",
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&q=80",
      link: "/category/oversized-fit",
      badge: "Trending",
    },
    {
      title: "Casual Joggers",
      image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=500&q=80",
      link: "/category/joggers",
      badge: "Best Seller",
    },
    {
      title: "Relaxed Fit Shirts",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&q=80",
      link: "/category/relaxed-fit",
      badge: "New Arrival",
    },
  ];

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
          The page you are looking for doesn't exist or has been moved. Don't worry, we have plenty of fresh casual collections waiting for you!
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

      {/* 2. Featured Casual Clothing Section */}
      <div className="max-w-6xl mx-auto w-full mt-16 pt-12 border-t border-zinc-800/80">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg md:text-xl font-bold uppercase tracking-wider">
              Explore Casual Styles
            </h3>
            {/* Updated Hindi text to English */}
            <p className="text-xs text-zinc-400 mt-1">
              Don't leave empty-handed, check out these trending casual outfits
            </p>
          </div>
          <Link
            href="/shop_by_collection"
            className="hidden md:flex items-center gap-1 text-xs font-semibold text-[#10b981] hover:underline"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Casual Clothes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {casualCategories.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group relative bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden hover:border-[#10b981]/50 transition-all duration-300"
            >
              {/* Image Container with Hover Zoom */}
              <div className="relative h-64 md:h-72 w-full overflow-hidden bg-zinc-950">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                
                {/* Badge */}
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[#10b981] text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider border border-[#10b981]/30">
                  {item.badge}
                </span>

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
              </div>

              {/* Text Info */}
              <div className="p-4 flex items-center justify-between bg-zinc-900/80">
                <h4 className="font-semibold text-sm tracking-wide text-zinc-100 group-hover:text-[#10b981] transition-colors">
                  {item.title}
                </h4>
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-[#10b981] group-hover:text-black transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default notfound;