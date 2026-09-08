"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Check, X, FolderTree } from "lucide-react";

export default function CategoriesPage() {
  // Demo Categories List (Supabase 'categories' table se fetch hoga)
  const [categories, setCategories] = useState([
    { id: 1, name: "T-Shirts", slug: "t-shirts", productCount: 12 },
    { id: 2, name: "Hoodies", slug: "hoodies", productCount: 8 },
    { id: 3, name: "Joggers", slug: "joggers", productCount: 5 },
  ]);

  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");

  // 1. ADD CATEGORY
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    const newItem = {
      id: Date.now(),
      name: newCategory,
      slug: newCategory.toLowerCase().replace(/\s+/g, "-"),
      productCount: 0,
    };

    setCategories([...categories, newItem]);
    setNewCategory("");
  };

  // 2. START EDITING
  const handleStartEdit = (cat) => {
    setEditingId(cat.id);
    setEditingName(cat.name);
  };

  // SAVE UPDATE
  const handleSaveEdit = (id) => {
    setCategories(
      categories.map((item) =>
        item.id === id
          ? {
              ...item,
              name: editingName,
              slug: editingName.toLowerCase().replace(/\s+/g, "-"),
            }
          : item
      )
    );
    setEditingId(null);
    setEditingName("");
  };

  // 3. DELETE CATEGORY
  const handleDeleteCategory = (id) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(categories.filter((item) => item.id !== id));
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
            {categories.map((cat) => (
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
                    {cat.productCount} Items
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}