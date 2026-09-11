"use client";

import React, { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, TicketPercent, X } from "lucide-react";

const emptyForm = {
  code: "",
  description: "",
  discountType: "PERCENTAGE",
  discountValue: "",
  minOrderValue: "0",
  startsAt: "",
  expiresAt: "",
  isActive: true,
};

const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const formatRemaining = (expiresAt) => {
  const remaining = new Date(expiresAt).getTime() - Date.now();
  if (remaining <= 0) return "Expired";
  const hours = Math.floor(remaining / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const days = Math.floor(hours / 24);
  return days > 0 ? `${days}d ${hours % 24}h left` : `${hours}h ${minutes}m left`;
};

export default function CouponPage() {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [, setClock] = useState(Date.now());

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/coupons?admin=1");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load coupons");
      setCoupons(data);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
    const timer = setInterval(() => setClock(Date.now()), 60000);
    return () => clearInterval(timer);
  }, []);

  const openCreate = () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 86400000);
    setEditingId(null);
    setForm({ ...emptyForm, startsAt: toInputDate(now), expiresAt: toInputDate(tomorrow) });
    setError("");
    setIsFormOpen(true);
  };

  const openEdit = (coupon) => {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderValue: String(coupon.minOrderValue),
      startsAt: toInputDate(coupon.startsAt),
      expiresAt: toInputDate(coupon.expiresAt),
      isActive: coupon.isActive,
    });
    setError("");
    setIsFormOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/coupons", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { ...form, id: editingId } : form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save coupon");
      setIsFormOpen(false);
      setForm(emptyForm);
      await loadCoupons();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    const response = await fetch(`/api/coupons?id=${id}`, { method: "DELETE" });
    if (response.ok) loadCoupons();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white">Coupons</h2>
          <p className="mt-1 text-xs text-zinc-500">Create scheduled offers customers can apply at cart.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-emerald-400">
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      {error && <p className="rounded border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">{error}</p>}

      {isFormOpen && (
        <form onSubmit={submit} className="grid gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 md:grid-cols-2">
          <div className="flex items-center justify-between md:col-span-2">
            <h3 className="text-sm font-bold uppercase tracking-wider">{editingId ? "Edit Coupon" : "Create Coupon"}</h3>
            <button type="button" onClick={() => setIsFormOpen(false)}><X className="h-4 w-4 text-zinc-400" /></button>
          </div>
          <label className="text-xs text-zinc-400">Code<input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="mt-2 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" placeholder="WELCOME10" /></label>
          <label className="text-xs text-zinc-400">Description<input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" placeholder="Welcome discount" /></label>
          <label className="text-xs text-zinc-400">Discount type<select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="mt-2 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none"><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed amount</option></select></label>
          <label className="text-xs text-zinc-400">Discount value<input required type="number" min="0.01" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="mt-2 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" /></label>
          <label className="text-xs text-zinc-400">Minimum order value<input type="number" min="0" step="0.01" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} className="mt-2 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none focus:border-emerald-500" /></label>
          <label className="text-xs text-zinc-400">Starts at<input required type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className="mt-2 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="text-xs text-zinc-400">Expires at<input required type="datetime-local" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="mt-2 w-full rounded border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none" /></label>
          <label className="flex items-center gap-2 text-xs text-zinc-300 md:col-span-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active coupon</label>
          <button disabled={saving} className="rounded bg-emerald-500 px-4 py-2.5 text-xs font-bold text-black disabled:opacity-50 md:col-span-2">{saving ? "Saving..." : "Save Coupon"}</button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="border-b border-zinc-800 bg-zinc-900 text-[10px] uppercase tracking-wider text-zinc-500"><tr><th className="p-4">Coupon</th><th className="p-4">Offer</th><th className="p-4">Schedule</th><th className="p-4">Status</th><th className="p-4 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-zinc-800 bg-zinc-950">
            {loading ? <tr><td colSpan="5" className="p-8 text-center text-zinc-500">Loading coupons...</td></tr> : coupons.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-zinc-500">No coupons created yet.</td></tr> : coupons.map((coupon) => {
              const current = Date.now();
              const active = coupon.isActive && new Date(coupon.startsAt).getTime() <= current && new Date(coupon.expiresAt).getTime() > current;
              return <tr key={coupon.id} className="text-zinc-300"><td className="p-4"><div className="flex items-center gap-2"><TicketPercent className="h-4 w-4 text-emerald-400" /><span className="font-bold text-white">{coupon.code}</span></div><p className="mt-1 text-zinc-500">{coupon.description || "No description"}</p></td><td className="p-4">{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}<p className="mt-1 text-zinc-500">Min ₹{coupon.minOrderValue}</p></td><td className="p-4"><p>{new Date(coupon.startsAt).toLocaleString("en-IN")}</p><p className="text-zinc-500">to {new Date(coupon.expiresAt).toLocaleString("en-IN")}</p><p className="mt-1 text-orange-400">{formatRemaining(coupon.expiresAt)}</p></td><td className="p-4"><span className={`rounded px-2 py-1 text-[10px] font-bold ${active ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>{active ? "ACTIVE" : "INACTIVE / EXPIRED"}</span></td><td className="p-4"><div className="flex justify-end gap-2"><button onClick={() => openEdit(coupon)} className="rounded border border-zinc-700 p-2 text-zinc-400 hover:text-white"><Pencil className="h-3.5 w-3.5" /></button><button onClick={() => deleteCoupon(coupon.id)} className="rounded border border-red-900/50 p-2 text-red-400 hover:bg-red-950/30"><Trash2 className="h-3.5 w-3.5" /></button></div></td></tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}