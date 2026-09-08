"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    originalPrice: "",
    fitTag: "RELAXED FIT",
    description: "",
    isSoldOut: false,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    availableSizes: ["S", "M", "L", "XL"],
    images: [],
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auto Generate Slug on Title Change
  const handleTitleChange = (e) => {
    const title = e.target.value;
    const generatedSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setFormData((prev) => ({
      ...prev,
      title,
      slug: generatedSlug,
    }));
  };

  // Toggle Available Sizes
  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const isAvailable = prev.availableSizes.includes(size);
      const updatedSizes = isAvailable
        ? prev.availableSizes.filter((s) => s !== size)
        : [...prev.availableSizes, size];

      return { ...prev, availableSizes: updatedSizes };
    });
  };

  // Handle Multi Image Select Preview
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImageFiles((prev) => [...prev, ...files]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newPreviews],
    }));
  };

  // Remove Selected Image
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit Handler (Supabase Upload Logic Template)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Image upload to Supabase Storage Bucket 'products' (when connected)
      // 2. Insert product JSON to Supabase Table 'products'
      
      console.log("Submitting Product Payload:", {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      });

      alert("Product details submitted successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-white">Add New Product</h2>
            <p className="text-xs text-zinc-400">Fill in details matching your ProductCard schema.</p>
          </div>
        </div>

        <button
          type="submit"
          form="add-product-form"
          disabled={loading}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
        >
          {loading ? "Publishing..." : "Publish Product"}
        </button>
      </div>

      <form id="add-product-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="md:col-span-2 space-y-5">
          {/* Title & Slug */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Product Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. EMPEROR RELAXED FIT T-SHIRT"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">URL Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Description</label>
              <textarea
                rows={4}
                placeholder="High quality relaxed fit t-shirt made with 100% premium cotton."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Pricing Details */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Sale Price (₹) *</label>
              <input
                type="number"
                required
                placeholder="1599"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Original Price (M.R.P ₹)</label>
              <input
                type="number"
                placeholder="1999"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
            <label className="block text-xs font-semibold text-zinc-300 uppercase">Product Images</label>

            <div className="grid grid-cols-4 gap-3">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 group">
                  <Image src={img} alt="preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black/80 text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <label className="aspect-[3/4] border-2 border-dashed border-zinc-800 hover:border-emerald-500/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-950/50">
                <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                <span className="text-[10px] text-zinc-400 font-medium">Upload</span>
                <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Attributes & Inventory */}
        <div className="space-y-5">
          {/* Fit Tag & Availability */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">Fit Tag</label>
              <select
                value={formData.fitTag}
                onChange={(e) => setFormData({ ...formData, fitTag: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="RELAXED FIT">RELAXED FIT</option>
                <option value="OVERSIZED FIT">OVERSIZED FIT</option>
                <option value="REGULAR FIT">REGULAR FIT</option>
                <option value="SLIM FIT">SLIM FIT</option>
              </select>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300 uppercase">Sold Out Status</span>
              <input
                type="checkbox"
                checked={formData.isSoldOut}
                onChange={(e) => setFormData({ ...formData, isSoldOut: e.target.checked })}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Sizes Selection */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-3">
            <label className="block text-xs font-semibold text-zinc-300 uppercase">
              Available Sizes (Toggle Status)
            </label>
            <p className="text-[10px] text-zinc-500">Unselected sizes will show strike-through on ProductCard.</p>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {AVAILABLE_SIZES.map((size) => {
                const isSelected = formData.availableSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      isSelected
                        ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                        : "bg-zinc-950 border-zinc-800 text-zinc-500 line-through"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}