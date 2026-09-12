"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const stars = [1, 2, 3, 4, 5];

const CategoryReviews = ({ productSlug }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const loadReviews = async (nextPage = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/reviews?productSlug=${encodeURIComponent(productSlug)}&page=${nextPage}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to load reviews");
      setReviews((current) => (nextPage === 1 ? data.reviews : [...current, ...data.reviews]));
      setAverageRating(data.averageRating || 0);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(Boolean(data.session));
      setCurrentUserId(data.session?.user?.id || "");
    });
  }, [productSlug]);

  const submitReview = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!rating || !body.trim()) {
      setMessage("Please select a star rating and write your review.");
      return;
    }

    setSaving(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ productSlug, rating, title, body }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to submit review");
      setTitle("");
      setBody("");
      setRating(0);
      setMessage("Your review has been saved.");
      await loadReviews();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteReview = async (reviewId) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const response = await fetch("/api/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ reviewId }),
    });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error || "Failed to delete review");
      return;
    }
    setMessage("Your review has been deleted.");
    await loadReviews();
  };

  return (
    <section className="mt-20 border-t border-zinc-800 pt-12 text-left">
      <div className="flex flex-col gap-4 border-b border-zinc-800 pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-wider text-white">Customer Reviews</h2>
          <p className="mt-2 text-sm text-zinc-400">{reviews.length ? `${averageRating.toFixed(1)} out of 5 from ${reviews.length} visible reviews` : "Be the first to review this product."}</p>
        </div>
        <div className="flex gap-1 text-xl text-amber-400" aria-label={`${averageRating} out of 5 stars`}>
          {stars.map((star) => <span key={star}>{star <= Math.round(averageRating) ? "★" : "☆"}</span>)}
        </div>
      </div>

      <form onSubmit={submitReview} className="mt-8 max-w-2xl rounded-lg border border-zinc-800 bg-zinc-950 p-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Write a review</h3>
        {!isLoggedIn && <p className="mt-2 text-xs text-zinc-400">Please <Link href="/login" className="text-emerald-400 hover:underline">log in</Link> to share your review.</p>}
        <div className="mt-4 flex items-center gap-1" aria-label="Choose rating">
          {stars.map((star) => <button key={star} type="button" onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? "text-amber-400" : "text-zinc-600"}`} aria-label={`${star} stars`}>★</button>)}
        </div>
        <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Review title (optional)" className="mt-4 w-full rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
        <textarea value={body} onChange={(event) => setBody(event.target.value)} placeholder="How was the product?" rows={4} className="mt-3 w-full rounded border border-zinc-800 bg-black px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
        <button type="submit" disabled={!isLoggedIn || saving} className="mt-3 rounded bg-emerald-500 px-4 py-2 text-xs font-bold uppercase text-black disabled:cursor-not-allowed disabled:opacity-40">{saving ? "Saving..." : "Submit Review"}</button>
        {message && <p className="mt-3 text-xs text-zinc-400">{message}</p>}
      </form>

      <div className="mt-8 space-y-3">
        {reviews.map((review) => <article key={review.id} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4"><div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold text-white">{review.user?.name || review.user?.username || "Customer"}</p><div className="text-sm text-amber-400">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div></div><div className="flex items-center gap-3"><time className="text-[10px] text-zinc-500">{new Date(review.createdAt).toLocaleDateString("en-IN")}</time>{currentUserId === review.user?.id && <button type="button" onClick={() => deleteReview(review.id)} className="text-[10px] font-semibold uppercase text-red-400 hover:text-red-300">Delete</button>}</div></div>{review.title && <h4 className="mt-3 text-sm font-semibold text-zinc-200">{review.title}</h4>}<p className="mt-1 text-sm leading-relaxed text-zinc-400">{review.body}</p></article>)}
        {!loading && reviews.length === 0 && <p className="text-sm text-zinc-500">No reviews yet.</p>}
        {hasMore && <button type="button" onClick={() => loadReviews(page + 1)} className="rounded border border-zinc-700 px-4 py-2 text-xs font-semibold uppercase text-zinc-200 hover:border-emerald-500">Load More Reviews</button>}
      </div>
    </section>
  );
};

export default CategoryReviews;
