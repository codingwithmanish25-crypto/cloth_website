"use client";

import React, { useEffect, useState } from "react";
import { Download, Mail, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const PAGE_SIZE = 50;

function escapeCsv(value) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSubscribers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/newsletter?page=${page}&limit=${PAGE_SIZE}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load subscribers");
      setSubscribers(data.subscribers || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setSelectedIds([]);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscribers();
  }, [page]);

  const allSelected = subscribers.length > 0 && subscribers.every((subscriber) => selectedIds.includes(subscriber.id));

  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : subscribers.map((subscriber) => subscriber.id));
  };

  const toggleSubscriber = (id) => {
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const downloadSelected = () => {
    const selected = subscribers.filter((subscriber) => selectedIds.includes(subscriber.id));
    if (!selected.length) return;

    const rows = [
      ["Email", "Subscribed At"],
      ...selected.map((subscriber) => [subscriber.email, new Date(subscriber.subscribedAt).toLocaleString("en-IN")]),
    ];
    const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `newsletter-subscribers-page-${page}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <Mail className="h-6 w-6 text-emerald-500" /> Newsletter Subscribers
          </h2>
          <p className="mt-1 text-xs text-zinc-400">Manage email subscribers and export selected contacts for campaigns.</p>
        </div>
        <button
          type="button"
          onClick={downloadSelected}
          disabled={!selectedIds.length}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download className="h-4 w-4" /> Download Selected ({selectedIds.length})
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-5 py-4">
          <span className="text-xs text-zinc-400">{total} total subscriber{total === 1 ? "" : "s"} · 50 per page</span>
          <label className="flex items-center gap-2 text-xs text-zinc-300">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} disabled={!subscribers.length} className="h-4 w-4 accent-emerald-500" />
            Select this page
          </label>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading subscribers...</div>
        ) : error ? (
          <p className="p-12 text-center text-sm text-red-400">{error}</p>
        ) : subscribers.length === 0 ? (
          <p className="p-12 text-center text-sm text-zinc-500">No newsletter subscribers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-900/80 uppercase text-[10px] tracking-wider text-zinc-400">
                <tr><th className="px-5 py-3">Select</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Subscribed At</th></tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="transition-colors hover:bg-zinc-900/60">
                    <td className="px-5 py-3"><input type="checkbox" checked={selectedIds.includes(subscriber.id)} onChange={() => toggleSubscriber(subscriber.id)} className="h-4 w-4 accent-emerald-500" /></td>
                    <td className="px-5 py-3 font-medium text-white">{subscriber.email}</td>
                    <td className="px-5 py-3 text-zinc-400">{new Date(subscriber.subscribedAt).toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
          <span className="text-xs text-zinc-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1 || loading} className="rounded border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800 disabled:opacity-30" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages || loading} className="rounded border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800 disabled:opacity-30" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}