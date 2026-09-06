import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SectionFirst = () => {
  const categories = [
    {
      id: 1,
      title: "OVERSIZED T-SHIRTS",
      href: "/category/oversized-fit",
      desktopImg: "/homesection/resize-dek-freedomgraft.webp", 
      mobileImg: "/homesection/FREEDOM-MOB-RESIZE.webp",
    },
    {
      id: 2,
      title: "JOGGER",
      href: "/category/joggers",
      desktopImg: "/homesection/milerfaux-dek-resize.webp",
      mobileImg: "/homesection/milerfaux-mob-resize.webp",
    },
    {
      id: 3,
      title: "JACKET",
      href: "/category/jacket",
      desktopImg: "/homesection/resize-dek-freedomgraft.webp",
      mobileImg: "/homesection/MOB_-_DENIM_1.webp",
    },
    {
      id: 4,
      title: "HOODIES",
      href: "/category/hoodies",
      desktopImg: "/homesection/resize-jogger.webp",
      mobileImg: "/homesection/resize-jogger_1.webp",
    },
    {
      id: 5,
      title: "DENIMS",
      href: "/category/denims",
      desktopImg: "/homesection/resize-dek-freedomgraft.webp",
      mobileImg: "/homesection/MOB_-_DENIM_1.webp",
    },
  ];

  return (
    <section className="w-full">
      {categories.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="relative w-full h-[85vh] md:h-screen block overflow-hidden group cursor-pointer"
        >
    
          <div className="hidden md:block w-full h-full relative">
            <Image
              src={item.desktopImg}
              alt={item.title}
              fill
              priority
              quality={100}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

      
          <div className="block md:hidden w-full h-full relative">
            <Image
              src={item.mobileImg}
              alt={item.title}
              fill
              priority
              quality={100}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          
          <div className="absolute inset-0 flex items-center justify-start p-8 md:p-16 z-20">
              <div className="max-w-md">
                <h2 className="text-white text-3xl md:text-5xl font-black tracking-widest uppercase drop-shadow-md">
                  {item.title}
                </h2>
                <p className="text-zinc-200 text-sm font-bold tracking-wider mt-2 underline underline-offset-4">
                  SHOP NOW
                </p>
              </div>
            </div>
        </Link>
      ))}
    </section>
  );
};

export default SectionFirst;