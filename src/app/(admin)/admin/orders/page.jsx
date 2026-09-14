"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingBag,
  Printer,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [printOrder, setPrintOrder] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/orders/admin?page=${page}`);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Could not load orders");
        setOrders(data.orders || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [page]);

  const updateStatus = async (id, status) => {
    const response = await fetch("/api/orders/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (response.ok)
      setOrders((current) =>
        current.map((order) =>
          order.id === id ? { ...order, status } : order,
        ),
      );
  };

  const printInvoice = (order) => {
    setPrintOrder(order);
    window.setTimeout(() => window.print(), 100);
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <ShoppingBag className="h-6 w-6 text-emerald-500" /> Orders
        </h2>
        <p className="mt-1 text-xs text-zinc-400">
          Manage pending, processing, delivered, and cancelled orders.
        </p>
      </div>
      <div className="orders-screen overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
        {loading ? (
          <div className="flex justify-center gap-2 p-10 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading orders...
          </div>
        ) : error ? (
          <p className="p-10 text-center text-sm text-red-400">{error}</p>
        ) : orders.length === 0 ? (
          <p className="p-10 text-center text-sm text-zinc-500">
            No orders yet.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {orders.map((order) => {
              const customerCancelled =
                order.status === "CANCELLED" &&
                order.cancelledBy === "CUSTOMER";
              return (
                <div
                  key={order.id}
                  className={`space-y-3 p-5 ${order.status === "CANCELLED" ? "bg-red-950/20" : ""}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Order #{order.id}
                      </p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {order.user?.name || order.user?.username || "Customer"}{" "}
                        · {order.user?.emails?.[0] || "No email"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm font-bold ${order.status === "CANCELLED" ? "text-red-400" : "text-white"}`}
                      >
                        ₹{Number(order.total).toLocaleString("en-IN")}
                      </span>
                      {customerCancelled ? (
                        <span className="rounded border border-red-500/50 bg-red-950 px-2 py-2 text-[11px] font-semibold text-red-300">
                          CANCELLED BY CUSTOMER
                        </span>
                      ) : (
                        <select
                          value={order.status}
                          onChange={(event) =>
                            updateStatus(order.id, event.target.value)
                          }
                          className={`rounded border px-2 py-2 text-[11px] text-white ${order.status === "CANCELLED" ? "border-red-500/50 bg-red-950" : "border-zinc-700 bg-zinc-950"}`}
                        >
                          <option>PENDING</option>
                          <option>PROCESSING</option>
                          <option>DELIVERED</option>
                          <option>CANCELLED</option>
                        </select>
                      )}
                      <button
                        type="button"
                        onClick={() => printInvoice(order)}
                        className="inline-flex items-center gap-1.5 rounded border border-zinc-700 bg-zinc-950 px-2.5 py-2 text-[11px] text-zinc-200 hover:border-emerald-500 hover:text-emerald-400"
                      >
                        <Printer className="h-3.5 w-3.5" /> Print Invoice
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Ship to: {order.address}
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Status:{" "}
                    <span
                      className={
                        order.status === "CANCELLED"
                          ? "text-red-400"
                          : "text-zinc-300"
                      }
                    >
                      {order.status}
                    </span>
                    {order.status === "CANCELLED" && (
                      <span className="ml-2 font-semibold text-red-400">
                        Cancelled by{" "}
                        {order.cancelledBy === "CUSTOMER"
                          ? "customer"
                          : "admin"}
                      </span>
                    )}{" "}
                    · Payment: {order.paymentStatus} ·{" "}
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
          <span className="text-xs text-zinc-500">
            {total} total orders · Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || loading}
              className="rounded border border-zinc-700 p-2 text-zinc-300 disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
              disabled={page === totalPages || loading}
              className="rounded border border-zinc-700 p-2 text-zinc-300 disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      {printOrder && (
        <div className="invoice-print p-10 text-black">
          <div className="flex items-start justify-between border-b-2 border-black pb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-wide">CLOTH STORE</h1>
              <p className="mt-1 text-sm">Tax Invoice</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-bold">Invoice #{printOrder.id}</p>
              <p>
                {new Date(printOrder.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 border-b border-zinc-300 py-6 text-sm">
            <div>
              <p className="mb-1 font-bold uppercase">Bill To</p>
              <p>
                {printOrder.user?.name ||
                  printOrder.user?.username ||
                  "Customer"}
              </p>
              <p>{printOrder.user?.emails?.[0] || ""}</p>
            </div>
            <div>
              <p className="mb-1 font-bold uppercase">Ship To</p>
              <p className="whitespace-pre-line">{printOrder.address}</p>
            </div>
          </div>
          <table className="mt-6 w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="py-2">Item</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Size</th>
                <th className="py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(printOrder.items) ? printOrder.items : []).map(
                (item, index) => (
                  <tr
                    key={`${printOrder.id}-${index}`}
                    className="border-b border-zinc-300"
                  >
                    <td className="py-3">{item.title || "Product"}</td>
                    <td className="py-3">{item.quantity || 1}</td>
                    <td className="py-3">{item.size || "-"}</td>
                    <td className="py-3 text-right">
                      ₹
                      {(
                        Number(item.price) * (item.quantity || 1)
                      ).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
          <div className="ml-auto mt-6 w-64 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                ₹{Number(printOrder.subtotal).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>
                - ₹{Number(printOrder.discount).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between border-t-2 border-black pt-2 text-base font-bold">
              <span>Total</span>
              <span>₹{Number(printOrder.total).toLocaleString("en-IN")}</span>
            </div>
          </div>
          <div className="mt-12 border-t border-zinc-300 pt-4 text-xs">
            <p>Payment status: {printOrder.paymentStatus}</p>
            <p className="mt-1">Thank you for shopping with Cloth Store.</p>
          </div>
        </div>
      )}
    </div>
  );
}
