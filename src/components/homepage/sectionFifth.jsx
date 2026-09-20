import { ArrowUpRight, Mail, Share2 } from "lucide-react";
import Link from "next/link";

const SectionFifth = () => {
  const journalLinks = [
    {
      label: "The oversized edit",
      href: "/shop_by_category?fit=OVERSIZED%20FIT",
    },
    { label: "Everyday layers", href: "/shop_by_collection/essentials" },
    { label: "Fresh arrivals", href: "/shop_by_collection" },
  ];

  return (
    <section className="border-t border-zinc-800 bg-[#0a0a0a] px-5 py-20 text-white sm:px-8 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
          <div className="border border-zinc-800 bg-[#131313] p-7 sm:p-10 md:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-400">
              The cloth journal
            </p>
            <h2 className="mt-6 max-w-2xl text-4xl font-black uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-7xl">
              Wear your own point of view.
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              Style is not about following every trend. It is about finding the
              pieces that feel like you, then wearing them your way.
            </p>
            <Link
              href="/shop_by_collection"
              className="mt-9 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:text-emerald-400"
            >
              Find your next uniform
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">
                Start here
              </p>
              <div className="mt-6 divide-y divide-zinc-800 border-y border-zinc-800">
                {journalLinks.map((item, index) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="group flex items-center justify-between gap-4 py-5"
                  >
                    <span className="flex items-center gap-4">
                      <span className="text-xs text-zinc-600">
                        0{index + 1}
                      </span>
                      <span className="text-sm font-bold uppercase tracking-wider text-zinc-200 transition-colors group-hover:text-emerald-400">
                        {item.label}
                      </span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-emerald-400" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-12 border-t border-zinc-800 pt-7">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-zinc-200">
                    Stay in the loop
                  </p>
                  <p className="mt-2 text-sm text-zinc-500">
                    New drops, early access, no noise.
                  </p>
                </div>
                <div className="flex gap-2 text-zinc-400">
                  <Mail className="h-5 w-5" strokeWidth={1.5} />
                  <Share2 className="h-5 w-5" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionFifth;
