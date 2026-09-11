"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Products on Mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (res.ok) {
          setProducts(Array.isArray(data) ? data : data.products || []);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 2. Toggle Sold Out Status
  const handleToggleSoldOut = async (id, currentStatus) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSoldOut: !currentStatus }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, isSoldOut: !currentStatus } : p
          )
        );
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  // 3. Delete Product Handler
  const handleDelete = async (id) => {
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

  return (
    <div className="p-6 text-white min-h-screen bg-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link
          href="/admin/products/add"
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2 rounded transition-colors"
        >
          + Add New Product
        </Link>
      </div>

      {loading ? (
        <p className="text-zinc-500 text-sm">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-zinc-500 text-sm">No products found.</p>
      ) : (
        <div className="overflow-x-auto border border-zinc-800 rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-zinc-900 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Fit / Stock Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 bg-zinc-950">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-zinc-900/50 transition-colors">
                  {/* Product Title & Image */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-8 h-8 rounded object-cover border border-zinc-800"
                      />
                    )}
                    <span className="font-medium text-zinc-200">
                      {product.title}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-zinc-300">
                    ₹{product.price}
                  </td>

                  {/* Fit Tag & Sold Out Toggle */}
                  <td className="py-3 px-4">
                    <div className="space-y-1.5">
                      {product.fitTag && (
                        <span className="inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                          {product.fitTag}
                        </span>
                      )}
                      <div>
                        <button
                          onClick={() =>
                            handleToggleSoldOut(product.id, product.isSoldOut)
                          }
                          className="cursor-pointer transition-opacity hover:opacity-80"
                        >
                          {product.isSoldOut ? (
                            <span className="text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 text-[10px] font-medium">
                              Sold Out (Click to In Stock)
                            </span>
                          ) : (
                            <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[10px] font-medium">
                              In Stock (Click to Sold Out)
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Edit & Delete Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/edit/${product.id}`}
                        className="p-1.5 bg-zinc-800/60 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}