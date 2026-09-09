"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Trash2, Edit, Loader2, PackageX, ExternalLink } from "lucide-react";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Products from Prisma Backend API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Product Handler
  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Delete Error:", error);
    }
  };

  // Filter products by search query
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products Management</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your store catalog, pricing, stock, and product availability.
          </p>
        </div>

        <Link
          href="/admin/products/add"
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-4 bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search product title or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="text-xs text-zinc-400 px-2">
          Total Products: <span className="text-emerald-400 font-bold">{filteredProducts.length}</span>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-zinc-900/80 uppercase text-[10px] text-zinc-400 font-semibold tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Fit / Stock</th>
                <th className="py-3.5 px-4">Sizes</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-zinc-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                      Loading catalog items...
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <PackageX className="w-8 h-8 text-zinc-600" />
                      <p>No products found matching your search.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-zinc-900/40 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-14 bg-zinc-950 rounded border border-zinc-800 overflow-hidden flex-shrink-0">
                          {product.images && product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-[10px] text-zinc-600">
                              No Image
                            </div>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <p className="font-semibold text-white line-clamp-1">{product.title}</p>
                          <p className="font-mono text-[10px] text-zinc-500">/{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="bg-zinc-800/80 text-zinc-300 px-2.5 py-1 rounded text-[11px]">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="text-emerald-400 font-semibold">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-zinc-500 line-through text-[10px]">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Fit Tag & Sold Out Status */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                          {product.fitTag}
                        </span>
                        <div>
                          {product.isSoldOut ? (
                            <span className="text-red-400 text-[10px] font-medium">Sold Out</span>
                          ) : (
                            <span className="text-emerald-500 text-[10px] font-medium">In Stock</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Sizes Available */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {product.availableSizes?.map((size) => (
                          <span key={size} className="bg-zinc-950 border border-zinc-800 text-zinc-400 text-[9px] px-1.5 py-0.5 rounded">
                            {size}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/product/${product.slug}`}
                          target="_blank"
                          className="p-1.5 bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                          title="View on Storefront"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1.5 bg-red-950/40 text-red-400 hover:bg-red-900/60 rounded transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}