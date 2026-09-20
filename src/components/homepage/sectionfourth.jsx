import { ArrowRight, RefreshCw, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const SectionFourth = () => {
  const trustPoints = [
    {
      icon: ShieldCheck,
      title: "Quality You Can Feel",
      description:
        "Premium fabrics, considered fits, and finishing that keeps up with your everyday.",
    },
    {
      icon: Sparkles,
      title: "Made For Your Style",
      description:
        "Clean silhouettes and versatile essentials designed to work with your wardrobe.",
    },
    {
      icon: RefreshCw,
      title: "Easy Exchange",
      description:
        "Picked the wrong size? Our simple exchange process has you covered.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-t border-zinc-800 bg-[#111111] px-5 py-20 text-white sm:px-8 md:py-28">
      <div className="pointer-events-none absolute -right-32 top-12 h-72 w-72 rounded-full border border-white/5" />
      <div className="pointer-events-none absolute -right-20 top-24 h-48 w-48 rounded-full border border-white/5" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-end lg:gap-20">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.35em] text-zinc-400">
              Why trust us
            </p>
            <h2 className="max-w-2xl text-4xl font-black uppercase leading-[0.95] tracking-tight text-zinc-100 sm:text-5xl md:text-6xl">
              Built for the way you move.
            </h2>
            <p className="mt-7 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              From the first sketch to the final stitch, every piece is made
              with an eye for detail and a feel for real life. Discover everyday
              clothing that looks sharp, feels effortless, and lasts longer.
            </p>

            <Link
              href="/shop_by_category"
              className="mt-9 inline-flex items-center gap-3 border border-white px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:bg-white hover:text-black"
            >
              Explore the collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 border-y border-zinc-800 py-8 sm:grid-cols-4 sm:gap-6 sm:border-y-0 sm:border-l sm:pl-10">
            <div>
              <p className="text-3xl font-black tracking-tight sm:text-4xl">
                1.7L+
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Happy customers
              </p>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight sm:text-4xl">
                5,820+
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Pincodes reached
              </p>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight sm:text-4xl">
                12 hrs
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Fast dispatch
              </p>
            </div>
            <div>
              <p className="text-3xl font-black tracking-tight sm:text-4xl">
                100%
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Good energy
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-8 border-t border-zinc-800 pt-10 md:grid-cols-3 md:gap-10">
          {trustPoints.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-zinc-700 text-zinc-200">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-100">
                  {title}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SectionFourth;
