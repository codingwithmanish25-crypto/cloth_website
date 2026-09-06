'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Console पर error log करें (Debugging के लिए)
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      
      {/* Background Subtle Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-2xl w-full text-center z-10 flex flex-col items-center">
        
        {/* Warning Badge */}
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-red-400 uppercase bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20 mb-6">
          <AlertTriangle className="w-4 h-4 text-red-500" /> Server Stitch Unraveled
        </span>

        {/* Big Stylized 500 Title */}
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-400 to-zinc-800 leading-none">
          500
        </h1>

        <h2 className="text-xl md:text-3xl font-bold uppercase tracking-wider mt-4">
          SOMETHING WENT WRONG ON OUR END!
        </h2>

        <p className="text-zinc-400 text-sm md:text-base max-w-md mt-3 font-normal">
          We encountered a unexpected glitch while loading this style. Our technical tailors are already on it!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {/* Try Again / Reset Button */}
          <button
            onClick={() => reset()}
            className="px-6 py-3.5 bg-[#10b981] text-black font-bold text-xs uppercase tracking-wider rounded-md hover:bg-[#00ff87] transition-all flex items-center gap-2 shadow-lg shadow-[#10b981]/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Try Reloading Page
          </button>

          {/* Go Home Button */}
          <Link
            href="/"
            className="px-6 py-3.5 bg-zinc-900 border border-zinc-800 text-white font-bold text-xs uppercase tracking-wider rounded-md hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back To Home
          </Link>
        </div>

        {/* Help Note */}
        <p className="text-xs text-zinc-500 mt-12 border-t border-zinc-800/80 pt-6 w-full max-w-sm">
          Need immediate assistance? Reach out to our support at{" "}
          <Link href="/contact-us" className="text-[#10b981] hover:underline font-semibold">
            Contact Support
          </Link>
        </p>

      </div>
    </div>
  );
}