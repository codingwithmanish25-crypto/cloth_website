"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

const FilterSidebar = ({ onFilterChange }) => {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFit, setSelectedFit] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [priceRange, setPriceRange] = useState(5000);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Accordion Toggles
  const [openSections, setOpenSections] = useState({
    category: true,
    fit: true,
    size: true,
    price: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Checkbox Selection Handler
  const handleCheckboxChange = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  // Clear All Filters
  const handleReset = () => {
    setSelectedCategory([]);
    setSelectedFit([]);
    setSelectedSize([]);
    setPriceRange(5000);
    setInStockOnly(false);
  };

  const categories = ["T-Shirt", "Bottomwear", "Winter Wear", "Polo", "Shirts"];
  const fits = ["Relaxed Fit", "Oversized Fit", "Sleeveless", "Baggy Fit"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <aside className="w-full lg:w-64 bg-[#121212] border border-[#27272a] p-4 rounded-lg text-white space-y-6 shrink-0 h-fit sticky top-24">
      {/* Header & Reset Button */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272a]">
        <h3 className="text-base font-semibold tracking-wide uppercase">Filters</h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="border-b border-[#27272a] pb-4">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex justify-between items-center text-sm font-medium py-1"
        >
          <span>Category</span>
          {openSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.category && (
          <div className="mt-3 space-y-2">
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={selectedCategory.includes(cat)}
                  onChange={() => handleCheckboxChange(cat, selectedCategory, setSelectedCategory)}
                  className="rounded bg-[#1a1a1a] border-gray-600 text-[#10b981] focus:ring-0 w-3.5 h-3.5"
                />
                {cat}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 2. Fit Tag Filter */}
      <div className="border-b border-[#27272a] pb-4">
        <button
          onClick={() => toggleSection("fit")}
          className="w-full flex justify-between items-center text-sm font-medium py-1"
        >
          <span>Fit Type</span>
          {openSections.fit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.fit && (
          <div className="mt-3 space-y-2">
            {fits.map((fit) => (
              <label key={fit} className="flex items-center gap-2.5 text-xs text-gray-300 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={selectedFit.includes(fit)}
                  onChange={() => handleCheckboxChange(fit, selectedFit, setSelectedFit)}
                  className="rounded bg-[#1a1a1a] border-gray-600 text-[#10b981] focus:ring-0 w-3.5 h-3.5"
                />
                {fit}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* 3. Size Filter */}
      <div className="border-b border-[#27272a] pb-4">
        <button
          onClick={() => toggleSection("size")}
          className="w-full flex justify-between items-center text-sm font-medium py-1"
        >
          <span>Size</span>
          {openSections.size ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.size && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => handleCheckboxChange(size, selectedSize, setSelectedSize)}
                  className={`py-1.5 text-xs border rounded transition-colors ${
                    isSelected
                      ? "bg-white text-black font-semibold border-white"
                      : "bg-[#18181b] text-gray-300 border-[#27272a] hover:border-gray-500"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Price Filter */}
      <div className="border-b border-[#27272a] pb-4">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex justify-between items-center text-sm font-medium py-1"
        >
          <span>Max Price</span>
          {openSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {openSections.price && (
          <div className="mt-3 space-y-2">
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#10b981] cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>₹500</span>
              <span className="text-white font-semibold">₹{priceRange}</span>
            </div>
          </div>
        )}
      </div>

      {/* 5. In-Stock Filter */}
      <div className="pt-1">
        <label className="flex items-center justify-between text-xs text-gray-300 cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="rounded bg-[#1a1a1a] border-gray-600 text-[#10b981] focus:ring-0 w-4 h-4"
          />
        </label>
      </div>
    </aside>
  );
};

export default FilterSidebar;