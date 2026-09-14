"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  Mail,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/contact?page=${page}`);
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Could not load contact queries");
        setMessages(data.messages || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [page]);

  const downloadExcel = async () => {
    const response = await fetch("/api/contact?export=csv");
    if (!response.ok) {
      setError("Could not download contact queries");
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contact-queries.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
            <Mail className="h-6 w-6 text-emerald-500" /> Contact Queries
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Customer messages received from the website contact form.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadExcel}
          className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-emerald-400"
        >
          <Download className="h-4 w-4" /> Download Excel
        </button>
      </div>

      {error && (
        <p className="rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
        <div className="border-b border-zinc-800 px-5 py-4 text-xs text-zinc-400">
          {total} total quer{total === 1 ? "y" : "ies"} · {PAGE_SIZE} per page
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 p-12 text-sm text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading queries...
          </div>
        ) : messages.length === 0 ? (
          <p className="p-12 text-center text-sm text-zinc-500">
            No contact queries yet.
          </p>
        ) : (
          <div className="divide-y divide-zinc-800">
            {messages.map((message) => (
              <article
                key={message.id}
                className="p-5 transition-colors hover:bg-zinc-900/60"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {message.email}
                    </p>
                    <p className="mt-1 text-[11px] text-zinc-500">
                      Query #{message.id} ·{" "}
                      {new Date(message.createdAt).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2 py-1 text-[10px] font-bold text-emerald-400">
                    {message.status}
                  </span>
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                  {message.message}
                </p>
              </article>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
          <span className="text-xs text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1 || loading}
              className="rounded border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800 disabled:opacity-30"
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
              className="rounded border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800 disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
