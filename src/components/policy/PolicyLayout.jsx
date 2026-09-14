import Link from "next/link";
import { ArrowUpRight, ChevronRight, Clock3, ShieldCheck } from "lucide-react";

const policyLinks = [
  { label: "Returns", href: "/policy/return-order" },
  { label: "Shipping", href: "/policy/shipping-policy" },
  { label: "Refunds", href: "/policy/refund-policy" },
  { label: "Terms", href: "/policy/terms" },
  { label: "Privacy", href: "/policy/privacy-policy" },
];

const PolicyLayout = ({
  eyebrow,
  title,
  description,
  updated,
  active,
  children,
}) => (
  <div className="min-h-screen bg-[#0a0a0a] text-white">
    <header className="relative overflow-hidden border-b border-zinc-800 bg-[#101313]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(16,185,129,0.14),transparent_34%),linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.025)_100%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="max-w-3xl">
          <p className="mb-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-400">
            <ShieldCheck className="h-4 w-4" /> Customer care / {eyebrow}
          </p>
          <h1 className="max-w-2xl text-4xl font-black uppercase leading-[0.98] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            {description}
          </p>
          <p className="mt-7 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
            <Clock3 className="h-3.5 w-3.5" /> Last updated {updated}
          </p>
        </div>
      </div>
    </header>

    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[220px_minmax(0,760px)] lg:gap-16 lg:px-12 lg:py-16">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500">
          Explore policies
        </p>
        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-1">
          {policyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex items-center justify-between border px-3 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
                active === link.label
                  ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
                  : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:border-zinc-600 hover:text-white"
              }`}
            >
              {link.label}
              <ChevronRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </nav>
        <div className="mt-6 hidden border-l border-emerald-500/50 pl-4 text-xs leading-5 text-zinc-500 lg:block">
          Need help with an order?
          <Link
            href="/contact-us"
            className="mt-1 flex items-center gap-1 font-semibold text-emerald-400 hover:text-emerald-300"
          >
            Contact support <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      <article className="min-w-0 text-sm leading-7 text-zinc-300 sm:text-[15px]">
        {children}
        <div className="mt-14 border-t border-zinc-800 pt-6 text-xs text-zinc-500">
          Questions about this policy? Reach us through our{" "}
          <Link href="/contact-us" className="text-emerald-400 hover:underline">
            contact page
          </Link>{" "}
          and include your order number where relevant.
        </div>
      </article>
    </div>
  </div>
);

export const PolicySection = ({ number, title, children }) => (
  <section className="border-b border-zinc-800/80 py-8 first:pt-0 last:border-b-0">
    <div className="flex gap-4 sm:gap-6">
      <span className="pt-1 text-xs font-bold tracking-widest text-emerald-400">
        {number}
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-bold uppercase tracking-wide text-white sm:text-xl">
          {title}
        </h2>
        <div className="mt-3 space-y-3">{children}</div>
      </div>
    </div>
  </section>
);

export default PolicyLayout;
