"use client";

import React, { useEffect, useState } from "react";
import { Check, Trash2, Star, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const PAGE_SIZE = 10;

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState("");

  const loadReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/reviews/admin?page=${page}&limit=${PAGE_SIZE}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load reviews");
      setReviews(data.reviews || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [page]);

  const updateReview = async (review, isApproved) => {
    await fetch("/api/reviews/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id, isApproved }),
    });
    setReviews((current) => current.map((item) => item.id === review.id ? { ...item, isApproved } : item));
  };

  const deleteReview = async (id) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/reviews/admin?id=${id}`, { method: "DELETE" });
    setReviews((current) => current.filter((review) => review.id !== id));
    setTotal((current) => Math.max(0, current - 1));
    if (reviews.length === 1 && page > 1) setPage((current) => current - 1);
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white"><Star className="h-6 w-6 text-emerald-500" /> Review Management</h2>
        <p className="mt-1 text-xs text-zinc-400">Review and manage customer feedback for every product.</p>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
        {loading ? <div className="flex items-center justify-center gap-2 p-8 text-sm text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading reviews...</div> : error ? <p className="p-8 text-center text-sm text-red-400">{error}</p> : reviews.length === 0 ? <p className="p-8 text-center text-sm text-zinc-500">No reviews submitted yet.</p> : <div className="divide-y divide-zinc-800">{reviews.map((review) => <article key={review.id} className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><span className="font-semibold text-white">{review.user?.name || review.user?.username || "Customer"}</span><span className="text-amber-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span><span className={`rounded px-2 py-1 text-[10px] uppercase ${review.isApproved ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>{review.isApproved ? "Visible" : "Hidden"}</span></div><p className="mt-2 text-xs text-emerald-400">{review.product?.title || "Unknown product"}</p>{review.title && <h3 className="mt-2 text-sm font-semibold text-zinc-200">{review.title}</h3>}<p className="mt-1 text-sm text-zinc-400">{review.body}</p></div><div className="flex shrink-0 gap-2"><button onClick={() => updateReview(review, !review.isApproved)} className="flex items-center gap-1 rounded bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400 hover:bg-emerald-500/20"><Check className="h-3.5 w-3.5" /> {review.isApproved ? "Hide" : "Approve"}</button><button onClick={() => deleteReview(review.id)} className="rounded bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20" title="Delete review"><Trash2 className="h-4 w-4" /></button></div></article>)}</div>}
        <div className="flex items-center justify-between border-t border-zinc-800 px-5 py-4">
          <span className="text-xs text-zinc-500">{total} total reviews · Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1 || loading} className="rounded border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800 disabled:opacity-30" aria-label="Previous page"><ChevronLeft className="h-4 w-4" /></button>
            <button type="button" onClick={() => setPage((current) => Math.min(totalPages, current + 1))} disabled={page === totalPages || loading} className="rounded border border-zinc-700 p-2 text-zinc-300 hover:bg-zinc-800 disabled:opacity-30" aria-label="Next page"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
