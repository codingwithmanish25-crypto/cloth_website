import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FolderTree,
  Users,
  LogOut,
  ExternalLink,
  TicketPercent,
  
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Cloth Store",
  description: "E-commerce Management Panel",
};

export default function AdminLayout({ children }) {
  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Customers", href: "/admin/users", icon: Users },
    { name: "Cupon", href: "/admin/cupon", icon: TicketPercent },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-800 bg-[#000000] flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Admin Header / Logo */}
          <div className="h-16 flex items-center px-6 border-b border-zinc-800 justify-between">
            <span className="font-bold text-lg tracking-wider text-emerald-500">
              ADMIN PANEL
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-200"
                >
                  <Icon className="w-4 h-4 text-emerald-500" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Bottom Action */}
        <div className="p-4 border-t border-zinc-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900/50 rounded-lg transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            className="flex items-center gap-3 w-full px-3 py-2.5 text-xs font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-800 bg-[#000000]/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
          <h1 className="text-sm font-semibold tracking-wide text-zinc-200 uppercase">
            Store Management Overview
          </h1>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xs font-bold">
              A
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-medium text-zinc-200">Admin User</p>
              <p className="text-zinc-500">admin@store.com</p>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}