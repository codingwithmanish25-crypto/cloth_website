'use client';

import React, { useState } from 'react';
import ProductCard from '@/components/productcard'; 
import Link from 'next/link';

const Sectionthird = () => {
  const [activeCategory, setActiveCategory] = useState(1);

  const productsData = [
    {
      id: 1,
      title: 'THE GLORY ARC RELAXED FIT T-SHIRT',
      price: 1599,
      fitTag: 'RELAXED FIT',
      isSoldOut: false,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      availableSizes: ['XS', 'S'],
      image: '/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp',
      slug: 'the-glory-arc-relaxed-fit',
    },
    {
      id: 2,
      title: 'SKY WALKER NAVY OVERSIZED T-SHIRT',
      price: 1599,
      originalPrice: 1999,
      fitTag: 'OVERSIZED FIT',
      isSoldOut: true,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      availableSizes: [],
      image: '/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp',
      slug: 'sky-walker-navy-oversized',
    },
    {
      id: 3,
      title: 'SKY WALKER NAVY OVERSIZED T-SHIRT',
      price: 1599,
      originalPrice: 1999,
      fitTag: 'OVERSIZED FIT',
      isSoldOut: false,
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      availableSizes: ['L', 'XL', 'XXL'],
      image: '/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp',
      slug: 'sky-walker-navy-oversized',
    },
  ];

  const category = [
    { id: 1, title: 'RELAXED FIT', href: '/collections/relaxed-fit-t-shirts' },
    { id: 2, title: 'OVERSIZED FIT', href: '/collections/relaxed-fit-t-shirts' },
    { id: 3, title: 'BOTTOMS', href: '/collections/joggers' },
    { id: 4, title: 'JACKETS', href: '/collections/winter-arrivals' },
    { id: 5, title: 'HOODIES', href: '/collections/hoodies' },
    { id: 6, title: 'POLO', href: '/collections/polo-shirts' },
    { id: 7, title: 'SHIRTS', href: '/collections/shirts' },
    { id: 8, title: 'SHORTS', href: '/collections/shorts' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 ">
      {/* Category Tabs */}
      <div className="flex items-center gap-3 overflow-x-auto pb-6 border-b border-zinc-800 mb-8">
        {category.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setActiveCategory(item.id)}
            className={`whitespace-nowrap px-4 py-2 text-xs font-bold tracking-widest uppercase  border transition-all duration-200 ${
              activeCategory === item.id
                ? 'bg-white text-black border-white'
                : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-[#25ef0e]'
            }`}
          >
            {item.title}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {productsData.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Sectionthird;