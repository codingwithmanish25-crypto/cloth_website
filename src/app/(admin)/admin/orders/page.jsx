"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, ShoppingBag } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/orders/admin?page=${page}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load orders");
        setOrders(data.orders || []); setTotal(data.total || 0); setTotalPages(data.totalPages || 1);
      } catch (loadError) { setError(loadError.message); } finally { setLoading(false); }
    };
    loadOrders();
  }, [page]);

  const updateStatus = async (id, status) => {
    const response = await fetch("/api/orders/admin", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (response.ok) setOrders((current) => current.map((order) => order.id === id ? { ...order, status } : order));
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div><h2 className="flex items-center gap-2 text-2xl font-bold text-white"><ShoppingBag className="h-6 w-6 text-emerald-500" /> Orders</h2><p className="mt-1 text-xs text-zinc-400">Manage pending, processing, delivered, and cancelled orders.</p></div>
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
        {loading ? <div className="flex justify-center gap-2 p-10 text-sm text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading orders...</div> : error ? <p className="p-10 text-center text-sm text-red-400">{error}</p> : orders.length === 0 ? <p className="p-10 text-center text-sm text-zinc-500">No orders yet.</p> : <div className="divide-y divide-zinc-800">{orders.map((order) => <div key={order.id} className={`space-y-3 p-5 ${order.status === "CANCELLED" ? "bg-red-950/20" : ""}`}><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-semibold text-white">Order #{order.id}</p><p className="mt-1 text-xs text-zinc-400">{order.user?.name || order.user?.username || "Customer"} · {order.user?.emails?.[0] || "No email"}</p></div><div className="flex items-center gap-3"><span className={`text-sm font-bold ${order.status === "CANCELLED" ? "text-red-400" : "text-white"}`}>₹{Number(order.total).toLocaleString("en-IN")}</span><select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)} className={`rounded border px-2 py-2 text-[11px] text-white ${order.status === "CANCELLED" ? "border-red-500/50 bg-red-950" : "border-zinc-700 bg-zinc-950"}`}><option>PENDING</option><option>PROCESSING</option><option>DELIVERED</option><option>CANCELLED</option></select></div></div><p className="text-xs text-zinc-400">Ship to: {order.address}</p><p className="text-[11px] text-zinc-500">Status: <span className={order.status === "CANCELLED" ? "text-red-400" : "text-zinc-300"}>{order.status}</span>{order.status === "CANCELLED" && <span className="ml-2 font-semibold text-red-400">Cancelled by {order.cancelledBy === "CUSTOMER" ? "customer" : "admin"}</span>} · Payment: {order.paymentStatus} · {new Date(order.createdAt).toLocaleString("en-IN")}</p></div>)}</div>}
        <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4"><span className="text-xs text-zinc-500">{total} total orders · Page {page} of {totalPages}</span><div className="flex gap-2"><button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1 || loading} className="rounded border border-zinc-700 p-2 text-zinc-300 disabled:opacity-30" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button><button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages || loading} className="rounded border border-zinc-700 p-2 text-zinc-300 disabled:opacity-30" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button></div></div>
      </div>
    </div>
  );
}