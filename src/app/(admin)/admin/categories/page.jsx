"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, FolderTree, Loader2, ChevronRight, Package } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [newGroup, setNewGroup] = useState("MEN");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingGroup, setEditingGroup] = useState("MEN");
  const [selectedGroup, setSelectedGroup] = useState("MEN");

  const groups = ["MEN", "WOMEN", "FOOTWEAR", "ACCESSORIES"];
  const groupedCategories = groups.map((group) => {
    const groupCategories = categories.filter((category) => category.group === group);
    return {
      group,
      categories: groupCategories,
      productCount: groupCategories.reduce(
        (total, category) => total + Number(category.productCount || 0),
        0
      ),
    };
  });
  const activeGroup = groupedCategories.find((item) => item.group === selectedGroup) || groupedCategories[0];
  const slugify = (value) =>
    value
      .toLowerCase()
      .trim()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

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
      const slug = `${newGroup.toLowerCase()}-${slugify(newCategory)}`;
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory, slug, group: newGroup }),
      });

      if (res.ok) {
        setNewCategory("");
        setNewGroup("MEN");
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
    setEditingGroup(cat.group === "OTHER" ? "MEN" : cat.group);
  };

  const handleSaveEdit = async (id) => {
    try {
      const slug = `${editingGroup.toLowerCase()}-${slugify(editingName)}`;
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingName, slug, group: editingGroup }),
      });

      if (res.ok) {
        setEditingId(null);
        setEditingName("");
        setEditingGroup("MEN");
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
        <select
          value={newGroup}
          onChange={(e) => setNewGroup(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
        >
          {groups.map((group) => <option key={group}>{group}</option>)}
        </select>
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

      {loading ? (
        <div className="py-8 text-center text-zinc-500">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
            Loading categories...
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-8 text-center text-zinc-500">No categories found. Create one above!</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groupedCategories.slice(0, 2).map(({ group, categories: groupCategories, productCount }) => (
              <button
                key={group}
                type="button"
                onClick={() => setSelectedGroup(group)}
                className={`text-left p-5 rounded-xl border transition-colors ${
                  selectedGroup === group
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Main Category</p>
                    <h3 className="mt-1 text-xl font-bold text-white">{group}</h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-bold text-emerald-400">{productCount}</p>
                    <p className="text-xs text-zinc-400">Total products</p>
                  </div>
                  <p className="text-xs text-zinc-500">{groupCategories.length} subcategories</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Subcategories</p>
                <h3 className="text-lg font-bold text-white">{activeGroup?.group || "Categories"}</h3>
              </div>
              <span className="text-xs text-zinc-500">Products assigned to each category</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(activeGroup?.categories || []).map((cat) => (
                <div key={cat.id} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
                  {editingId === cat.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-full bg-zinc-950 border border-emerald-500 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                      />
                      <select
                        value={editingGroup}
                        onChange={(e) => setEditingGroup(e.target.value)}
                        className="w-full bg-zinc-950 border border-emerald-500 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
                      >
                        {groups.map((group) => <option key={group}>{group}</option>)}
                      </select>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-white">{cat.name}</h4>
                        <p className="mt-1 text-[10px] font-mono text-zinc-500">{cat.slug}</p>
                      </div>
                      <Package className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-800 pt-3">
                    <span className="text-sm font-semibold text-zinc-200">
                      {cat.productCount ?? 0} <span className="text-xs font-normal text-zinc-500">products</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {editingId === cat.id ? (
                        <>
                          <button type="button" onClick={() => handleSaveEdit(cat.id)} className="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded" title="Save">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => setEditingId(null)} className="p-1.5 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 rounded" title="Cancel">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button type="button" onClick={() => handleStartEdit(cat)} className="p-1.5 bg-zinc-800/60 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded" title="Edit">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button type="button" onClick={() => handleDeleteCategory(cat.id)} className="p-1.5 bg-red-950/40 text-red-400 hover:bg-red-900/60 rounded" title="Delete">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}