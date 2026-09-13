"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Package, Users, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load dashboard");
        setDashboard(data);
      })
      .catch((loadError) => setError(loadError.message));
  }, []);

  const stats = dashboard
    ? [
        { title: "Total Revenue", value: `₹${dashboard.stats.revenue.toLocaleString("en-IN")}`, change: `${dashboard.stats.paidOrders} paid`, icon: DollarSign },
        { title: "Total Orders", value: dashboard.stats.orders.toLocaleString("en-IN"), change: "All statuses", icon: ShoppingBag },
        { title: "Products Active", value: `${dashboard.stats.activeProducts}/${dashboard.stats.products}`, change: "In stock / total", icon: Package },
        { title: "Total Customers", value: dashboard.stats.customers.toLocaleString("en-IN"), change: "Registered users", icon: Users },
      ]
    : [];

  const recentOrders = dashboard?.recentOrders || [];

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

      {error && <p className="rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">{error}</p>}

      {/* STATS METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(stats.length ? stats : Array.from({ length: 4 }, (_, index) => ({ title: "Loading...", value: "-", change: "", icon: [DollarSign, ShoppingBag, Package, Users][index] }))).map((item, index) => {
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
              {recentOrders.length === 0 ? <tr><td colSpan="6" className="py-10 text-center text-zinc-500">No orders in the database yet.</td></tr> : recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-emerald-400">#{order.id}</td>
                  <td className="py-3.5 px-4 font-medium text-white">{order.user?.name || order.user?.username || "Customer"}</td>
                  <td className="py-3.5 px-4 text-zinc-400">{Array.isArray(order.items) ? order.items.map((item) => `${item.quantity || 1}x ${item.title || "Product"}`).join(", ") : "-"}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">₹{Number(order.total).toLocaleString("en-IN")}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        order.status === "DELIVERED"
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : order.status === "PROCESSING"
                          ? "bg-amber-950 text-amber-400 border border-amber-800"
                          : "bg-blue-950 text-blue-400 border border-blue-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-500">{new Date(order.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}