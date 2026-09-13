"use client";

import { useEffect, useState } from "react";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers")
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load customers");
        setCustomers(data);
      })
      .catch((loadError) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div><h2 className="text-2xl font-bold text-white">Customers</h2><p className="mt-1 text-xs text-zinc-400">Registered customers and their order history.</p></div>
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/40">
        {loading ? <p className="p-10 text-center text-sm text-zinc-500">Loading customers...</p> : error ? <p className="p-10 text-center text-sm text-red-400">{error}</p> : customers.length === 0 ? <p className="p-10 text-center text-sm text-zinc-500">No customers yet.</p> : <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="border-b border-zinc-800 bg-zinc-900/80 text-[10px] uppercase tracking-wider text-zinc-400"><tr><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Orders</th><th className="px-5 py-3">Total spent</th><th className="px-5 py-3">Joined</th></tr></thead><tbody className="divide-y divide-zinc-800">{customers.map((customer) => <tr key={customer.id}><td className="px-5 py-4 font-medium text-white">{customer.name || customer.username}</td><td className="px-5 py-4 text-zinc-400">{customer.email || "-"}</td><td className="px-5 py-4 text-zinc-300">{customer.orderCount}</td><td className="px-5 py-4 font-semibold text-white">₹{customer.totalSpent.toLocaleString("en-IN")}</td><td className="px-5 py-4 text-zinc-500">{new Date(customer.createdAt).toLocaleDateString("en-IN")}</td></tr>)}</tbody></table></div>}
      </div>
    </div>
  );
}