"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

const AVAILABLE_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export default function EditProductPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    categoryId: "",
    price: "",
    originalPrice: "",
    fitTag: "RELAXED FIT",
    description: "",
    isSoldOut: false,
    availableSizes: ["S", "M", "L", "XL"],
    images: [], // Existing + Preview URLs
  });

  const [categories, setCategories] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]); // Nayi select ki hui files
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Fetch Categories & Product Details on Mount
  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Categories
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        if (Array.isArray(catData)) setCategories(catData);

        // Fetch Current Product
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();

        if (res.ok) {
          const loadedPrice = Number(data.price) || 0;
          const loadedOriginalPrice = Number(data.originalPrice) || 0;
          const hasOriginalPrice = loadedOriginalPrice > 0;

          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            categoryId: data.categoryId || "",
            price: String(hasOriginalPrice ? Math.min(loadedPrice, loadedOriginalPrice) : loadedPrice),
            originalPrice: hasOriginalPrice ? String(Math.max(loadedPrice, loadedOriginalPrice)) : "",
            fitTag: data.fitTag || "RELAXED FIT",
            description: data.description || "",
            isSoldOut: data.isSoldOut || false,
            availableSizes: Array.isArray(data.availableSizes) ? data.availableSizes : ["S", "M", "L", "XL"],
            images: Array.isArray(data.images) ? data.images : data.imageUrl ? [data.imageUrl] : [],
          });
        } else {
          alert("Product not found");
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error loading product data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (productId) fetchData();
  }, [productId, router]);

  // Handle Title Change & Slug Sync
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
    setNewImageFiles((prev) => [...prev, ...files]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newPreviews],
    }));
  };

  // Remove Selected Image
  const handleRemoveImage = (index) => {
    setFormData((prev) => {
      const targetUrl = prev.images[index];
      // Agar wo naye local dynamic object URL wale images me se hai toh array update karein
      if (targetUrl.startsWith("blob:")) {
        const blobIndex = prev.images.filter((img) => img.startsWith("blob:")).indexOf(targetUrl);
        if (blobIndex !== -1) {
          setNewImageFiles((files) => files.filter((_, i) => i !== blobIndex));
        }
      }
      return {
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      };
    });
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (formData.images.length === 0) {
        alert("At least one product image is required.");
        setSaving(false);
        return;
      }

      // Existing Supabase URLs filter karein
      const finalImageUrls = formData.images.filter((img) => !img.startsWith("blob:"));

      // Nayi dynamic images ko Supabase par upload karein
      for (const file of newImageFiles) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `items/${fileName}`;

        const { error } = await supabase.storage
          .from("products")
          .upload(filePath, file);

        if (error) {
          throw new Error(`Storage Upload Error: ${error.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        finalImageUrls.push(publicUrlData.publicUrl);
      }

      // API call to PUT route
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          slug: formData.slug,
          categoryId: formData.categoryId || null,
          price: Number(formData.price),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
          fitTag: formData.fitTag,
          description: formData.description,
          isSoldOut: formData.isSoldOut,
          availableSizes: formData.availableSizes,
          images: finalImageUrls,
          imageUrl: finalImageUrls[0] || null, // First image as main display image
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update product");
      }

      alert("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error updating product:", error);
      alert(`Failed to update product: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
      </div>
    );
  }

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
            <h2 className="text-xl font-bold text-white">Edit Product</h2>
            <p className="text-xs text-zinc-400">Update details for this product.</p>
          </div>
        </div>

        <button
          type="submit"
          form="edit-product-form"
          disabled={saving}
          className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
        >
          {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>

      <form id="edit-product-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="md:col-span-2 space-y-5">
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
                  <Image
                    src={img}
                    alt="preview"
                    fill
                    sizes="(max-width: 768px) 25vw, 160px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-1 right-1 bg-black/80 text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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

        {/* Right Column - Category, Attributes & Inventory */}
        <div className="space-y-5">
          {/* Category Dropdown Selection */}
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-5 space-y-2">
            <label className="block text-xs font-semibold text-zinc-300 uppercase">Category</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="">Select Category (Optional)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

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
              Available Sizes
            </label>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {AVAILABLE_SIZES.map((size) => {
                const isSelected = formData.availableSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
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