import { MapPin, Truck, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Sectiontwo = () => {
  // Image layout grid data array
  const category = [
    {
      id: 1,
      title: "RELAXED FIT",
      href: "/category/relaxed-fit",
      sectionimage: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp"
    },
    {
      id: 2,
      title: "OVERSIZED T-SHIRTS",
      href: "/category/oversized-tshirts",
      sectionimage: "/homesection/oversizedfit-collection_tile_238x238_b3816dc9-d000-4a20-bc5e-e2dbb5be3168.webp"
    },
    {
      id: 3,
      title: "SLEEVELESS",
      href: "/category/sleeveless",
      sectionimage: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp"
    },
    {
      id: 4,
      title: "JACKET",
      href: "/category/jacket",
      sectionimage: "/homesection/oversizedfit-collection_tile_238x238_b3816dc9-d000-4a20-bc5e-e2dbb5be3168.webp"
    },
    {
      id: 5,
      title: "JOGGERS",
      href: "/category/joggers",
      sectionimage: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp"
    },
    {
      id: 6,
      title: "DENIM",
      href: "/category/denim",
      sectionimage: "/homesection/oversizedfit-collection_tile_238x238_b3816dc9-d000-4a20-bc5e-e2dbb5be3168.webp"
    },
    {
      id: 7,
      title: "HOODIES",
      href: "/category/hoodies",
      sectionimage: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp"
    },
    {
      id: 8,
      title: "SHIRTS",
      href: "/category/shirts",
      sectionimage: "/homesection/oversizedfit-collection_tile_238x238_b3816dc9-d000-4a20-bc5e-e2dbb5be3168.webp"
    },
    {
      id: 9,
      title: "POLO SHIRTS",
      href: "/category/polo-shirts",
      sectionimage: "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp"
    }
  ];

  return (
    <div className="w-full bg-[#0a0a0a] text-white py-8">
      
      {/* 1. Top Stats / Features Bar */}
      <div className="max-w-6xl mx-auto flex flex-wrap justify-around items-center border-b border-zinc-800 pb-10 px-4 text-center gap-6">
        
        {/* Satisfied Customers */}
        <div className="flex flex-col items-center space-y-1">
          <Users className="w-6 h-6 text-zinc-300 stroke-[1.5]" />
          <p className="text-sm font-bold tracking-wide">1,70,000+</p>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Satisfied Customers</p>
        </div>

        {/* Pincodes Reached */}
        <div className="flex flex-col items-center space-y-1">
          <MapPin className="w-6 h-6 text-zinc-300 stroke-[1.5]" />
          <p className="text-sm font-bold tracking-wide">5,820+</p>
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Pincodes Reached</p>
        </div>

        {/* Fast Delivery */}
        <div className="flex flex-col items-center space-y-1">
          <Truck className="w-6 h-6 text-zinc-300 stroke-[1.5]" />
          <p className="text-xs text-zinc-400 uppercase tracking-wider">Ships Within</p>
          <p className="text-sm font-bold tracking-wide">12 Hours</p>
        </div>
      </div>

      {/* 2. Shop By Category Title */}
      <div className="text-center pt-10 pb-6">
        <h2 className="text-2xl font-black uppercase tracking-widest text-zinc-100">
          Shop By Category
        </h2>
      </div>

      {/* 3. 3x3 Category Grid (Exact Overlays Style) */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
          {category.map((item) => (
            <Link 
              key={item.id} 
              href={item.href}
              className="group relative h-[380px] w-full overflow-hidden bg-zinc-900 rounded-sm border border-zinc-800/50 block"
            >
              {/* Product Image */}
              <Image 
                src={item.sectionimage} 
                alt={item.title} 
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Bottom Gradient Overlay (Exact reference matching) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

              {/* Title Text at Bottom Center */}
              <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-widest text-white drop-shadow-md">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Sectiontwo;