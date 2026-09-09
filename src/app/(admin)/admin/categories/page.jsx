"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, FolderTree, Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // 1. FETCH CATEGORIES FROM PRISMA API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. ADD CATEGORY
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const slug = newCategory.toLowerCase().trim().replace(/\s+/g, "-");
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory, slug }),
      });

      if (res.ok) {
        setNewCategory("");
        fetchCategories();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to add category");
      }
    } catch (err) {
      console.error("Add Category Error:", err);
    }
  };

  // 3. EDIT CATEGORY
  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  const handleSaveEdit = async (id) => {
    try {
      const slug = editingName.toLowerCase().trim().replace(/\s+/g, "-");
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName, slug }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditingName("");
        fetchCategories();
      } else {
        alert("Failed to update category");
      }
    } catch (err) {
      console.error("Edit Category Error:", err);
    }
  };

  // 4. DELETE CATEGORY
  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch (err) {
      console.error("Delete Category Error:", err);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <FolderTree className="w-6 h-6 text-emerald-500" />
          Category Management
        </h2>
        <p className="text-xs text-zinc-400 mt-1">
          Create, update, or remove store categories for your collections.
        </p>
      </div>

      {/* ADD CATEGORY FORM */}
      <form
        onSubmit={handleAddCategory}
        className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl flex items-center gap-3"
      >
        <input
          type="text"
          placeholder="Enter new category name (e.g. Oversized Tees)"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </form>

      {/* CATEGORIES TABLE */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="bg-zinc-900/80 uppercase text-[10px] text-zinc-400 font-semibold tracking-wider border-b border-zinc-800">
            <tr>
              <th className="py-3.5 px-4">Category Name</th>
              <th className="py-3.5 px-4">Slug</th>
              <th className="py-3.5 px-4">Products</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {loading ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-zinc-500">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    Loading categories...
                  </div>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-8 text-center text-zinc-500">
                  No categories found. Create one above!
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-white">
                    {editingId === cat.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="bg-zinc-950 border border-emerald-500 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      />
                    ) : (
                      cat.name
                    )}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-zinc-400">
                    {cat.slug}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-medium">
                      {cat.productCount ?? 0} Items
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(cat.id)}
                            className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded transition-colors"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 rounded transition-colors"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleStartEdit(cat)}
                            className="p-1.5 bg-zinc-800/60 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-1.5 bg-red-950/40 text-red-400 hover:bg-red-900/60 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}