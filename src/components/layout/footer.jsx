import React from 'react';
import Link from 'next/link';
import { MoveRight } from 'lucide-react';

const footer = () => {
  const company = [
    { title: "Home page", href: "/" },
    { title: "Contact Us", href: "/contact-us" },
    { title: "Login", href: "/login" },
    { title: "Track My Order", href: "/track-order" },
  ];

  const policies = [
    { title: "Return Your Order", href: "/policy/return-order" },
    { title: "Shipping Policy", href: "/policy/shipping-policy" },
    { title: "Return, Refund and Cancellation", href: "/policy/refund-policy" },
    { title: "Terms and Conditions", href: "/policy/terms" },
    { title: "Privacy Policy", href: "/policy/privacy-policy" },
    { title: "Contact Us", href: "/contact-us" },
  ];

  return (
    <footer className="w-full bg-[#0a0a0a] text-white border-t border-[#27272a] pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        
        {/* TOP SECTION: Newsletter Subscription */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-12 border-b border-[#27272a]">
          <div className="max-w-xl">
            <h2 className="text-xl md:text-2xl font-bold tracking-wider uppercase text-white">
              JOIN THE COMMUNITY OF CHANGE MAKERS
            </h2>
            <p className="text-sm text-zinc-400 mt-1 capitalize">
              Get exclusive deals and early access to new products
            </p>
          </div>

          {/* Email Input Field */}
          <div className="relative w-full md:w-96 flex items-center">
            <input
              type="email"
              placeholder="Email address"
              className="w-full bg-zinc-900/80 border border-zinc-800 text-sm text-white placeholder-zinc-500 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-[#10b981] transition-colors"
            />
            <button 
              className="absolute right-2 p-2 text-zinc-400 hover:text-[#10b981] transition-colors cursor-pointer"
              aria-label="Subscribe"
            >
              <MoveRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BOTTOM SECTION: Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold tracking-widest text-[#10b981] uppercase">
              COMPANY
            </h3>
            <div className="flex flex-col gap-2.5">
              {company.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-sm text-zinc-400 hover:text-[#25ef0e] transition-colors duration-150 w-fit"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Policies Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-bold tracking-widest text-[#10b981] uppercase">
              POLICIES
            </h3>
            <div className="flex flex-col gap-2.5">
              {policies.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="text-sm text-zinc-400 hover:text-[#25ef0e] transition-colors duration-150 w-fit"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Copyright footer */}
        <div className="pt-8 border-t border-zinc-900 text-center md:text-left text-xs text-zinc-500">
          © {new Date().getFullYear()} Cloth website. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default footer;