"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setError("Please login to view your orders."); setLoading(false); return; }
      const response = await fetch("/api/orders", { headers: { Authorization: `Bearer ${session.access_token}` } });
      const data = await response.json();
      if (response.ok) setOrders(data); else setError(data.error || "Could not load orders");
      setLoading(false);
    };
    loadOrders();
  }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm("Cancel this pending order?")) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setError("Your login session expired. Please log in again.");
      return;
    }
    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    const data = await response.json();
    if (response.ok) setOrders((current) => current.map((order) => order.id === id ? data : order));
    else setError(data.error || "Could not cancel order");
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-bold">My Orders</h1>
        {loading ? <p className="mt-6 text-sm text-zinc-500">Loading orders...</p> : error ? <p className="mt-6 text-sm text-red-400">{error}</p> : orders.length === 0 ? <p className="mt-6 text-sm text-zinc-500">No orders yet.</p> : <div className="mt-6 space-y-4">{orders.map((order) => { const isPending = order.status === "PENDING"; const isCancelled = order.status === "CANCELLED"; return <article key={order.id} className={`rounded-xl border p-5 ${isCancelled ? "border-red-500/30 bg-red-950/20" : "border-zinc-800 bg-zinc-900/50"}`}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-semibold">Order #{order.id}</h2><p className="mt-1 text-xs text-zinc-500">{new Date(order.createdAt).toLocaleString("en-IN")}</p></div><span className={`rounded px-2 py-1 text-[10px] font-bold ${isCancelled ? "text-red-400" : "text-emerald-400"}`}>{order.status}</span></div><div className="mt-4 space-y-2 border-y border-zinc-800 py-3">{Array.isArray(order.items) && order.items.map((item, index) => <div key={`${order.id}-${index}`} className="flex items-center justify-between gap-3 text-xs"><span className="text-zinc-300">{item.title || "Product"} <span className="text-zinc-500">x{item.quantity || 1}{item.size ? `, ${item.size}` : ""}</span></span><span className="text-zinc-400">₹{(Number(item.price) * (item.quantity || 1)).toLocaleString("en-IN")}</span></div>)}</div><p className="mt-3 text-xs text-zinc-400">Deliver to: {order.address}</p><p className="mt-2 text-sm font-bold">₹{Number(order.total).toLocaleString("en-IN")}</p>{isPending ? <button onClick={() => cancelOrder(order.id)} className="mt-4 rounded border border-red-500/40 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10">Cancel order</button> : <button type="button" disabled className="mt-4 cursor-not-allowed rounded border border-zinc-700 px-3 py-2 text-xs text-zinc-500">{isCancelled ? "Order cancelled" : "Cancellation unavailable"}</button>}</article>; })}</div>}
        <Link href="/" className="mt-6 inline-block text-xs text-emerald-400 hover:underline">Continue shopping</Link>
      </div>
    </main>
  );
}
