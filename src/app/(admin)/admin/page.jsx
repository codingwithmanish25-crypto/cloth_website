import React from "react";
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  // Demo Analytics Data (Supabase DB se live replace hoga)
  const stats = [
    { title: "Total Revenue", value: "₹1,24,500", change: "+12.5%", icon: DollarSign },
    { title: "Total Orders", value: "84", change: "+8.2%", icon: ShoppingBag },
    { title: "Products Active", value: "24", change: "0", icon: Package },
    { title: "Total Customers", value: "142", change: "+18.4%", icon: Users },
  ];

  const recentOrders = [
    { id: "ORD-8921", customer: "Rahul Sharma", items: "2x T-Shirt", total: "₹3,198", status: "Delivered", date: "Today" },
    { id: "ORD-8920", customer: "Priya Patel", items: "1x Joggers", total: "₹1,599", status: "Processing", date: "Today" },
    { id: "ORD-8919", customer: "Amit Kumar", items: "1x Hoodie", total: "₹2,499", status: "Shipped", date: "Yesterday" },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner Heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time metric summary from your store.
          </p>
        </div>
        <Link
          href="/admin/products/add"
          className="bg-emerald-500 hover:bg-emerald-600 text-black text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          + Add New Product
        </Link>
      </div>

      {/* STATS METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">{item.title}</span>
                <div className="p-2 bg-zinc-800/80 rounded-lg text-emerald-400">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xl font-bold text-white">{item.value}</span>
                <span className="text-[11px] font-medium text-emerald-400 flex items-center">
                  {item.change} <ArrowUpRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Customer Orders</h3>
          <Link href="/admin/orders" className="text-xs text-emerald-400 hover:underline">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 uppercase text-[10px] text-zinc-400 font-semibold tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-emerald-400">{order.id}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{order.customer}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{order.items}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{order.total}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        order.status === "Delivered"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : order.status === "Processing"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-blue-950 text-blue-400 border border-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}