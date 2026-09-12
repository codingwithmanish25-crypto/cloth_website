"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Check, ArrowUpDown } from "lucide-react";
import { WEBSITE_CATEGORY_ROWS } from "@/lib/websiteCategories";

const FilterSidebar = ({ onFilterChange, initialCategory = "" }) => {
  const categories = WEBSITE_CATEGORY_ROWS;
  const categoryGroups = [...new Set(categories.map((category) => category.group))];
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory ? [initialCategory] : []
  );
  const [selectedFit, setSelectedFit] = useState([]);
  const [selectedSize, setSelectedSize] = useState([]);
  const [priceRange, setPriceRange] = useState(50000);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [openCategoryGroup, setOpenCategoryGroup] = useState(
    initialCategory
      ? categories.find((category) => category.slug === initialCategory)?.group || "MEN"
      : "MEN"
  );

  const [openSections, setOpenSections] = useState({
    sort: true,
    category: true,
    fit: true,
    size: true,
    price: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxChange = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const handleReset = () => {
    setSelectedCategory([]);
    setSelectedFit([]);
    setSelectedSize([]);
    setPriceRange(50000);
    setInStockOnly(false);
    setSortBy("recommended");
  };

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        sortBy,
        category: selectedCategory,
        fit: selectedFit,
        size: selectedSize,
        maxPrice: priceRange,
        inStockOnly,
      });
    }
  }, [sortBy, selectedCategory, selectedFit, selectedSize, priceRange, inStockOnly]);

  const fits = ["RELAXED FIT", "OVERSIZED FIT", "REGULAR FIT", "SLIM FIT"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const sortOptions = [
    { label: "Recommended", value: "recommended" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Alphabetical: A to Z", value: "alpha_asc" },
    { label: "Alphabetical: Z to A", value: "alpha_desc" },
  ];

  const totalActiveFilters =
    selectedCategory.length +
    selectedFit.length +
    selectedSize.length +
    (inStockOnly ? 1 : 0) +
    (priceRange < 50000 ? 1 : 0);

  return (
    <aside className="w-full lg:w-72 bg-[#121214] border border-zinc-800/80 p-5 text-zinc-100 shadow-xl backdrop-blur-md shrink-0 h-fit sticky top-24 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-200">
            Filters
          </h3>
          {totalActiveFilters > 0 && (
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
              {totalActiveFilters} active
            </span>
          )}
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-emerald-400 transition-colors duration-200 font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset
        </button>
      </div>

      {/* Sort Section */}
      <div className="border-b border-zinc-800 pb-5">
        <button
          onClick={() => toggleSection("sort")}
          className="w-full flex justify-between items-center text-sm font-semibold text-zinc-200 py-1 hover:text-emerald-400 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-emerald-400" /> Sort By
          </span>
          {openSections.sort ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>

        {openSections.sort && (
          <div className="mt-3 space-y-1.5">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-between ${
                  sortBy === option.value
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent"
                }`}
              >
                <span>{option.label}</span>
                {sortBy === option.value && (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fit Section */}
      <div className="border-b border-zinc-800 pb-5">
        <button
          onClick={() => toggleSection("fit")}
          className="w-full flex justify-between items-center text-sm font-semibold text-zinc-200 py-1 hover:text-emerald-400 transition-colors"
        >
          <span>Fit Type</span>
          {openSections.fit ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>
        {openSections.fit && (
          <div className="mt-3 space-y-2.5">
            {fits.map((fit) => {
              const checked = selectedFit.includes(fit);
              return (
                <label
                  key={fit}
                  className="flex items-center gap-3 text-xs text-zinc-300 cursor-pointer hover:text-white transition-colors group"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                      checked
                        ? "bg-emerald-500 border-emerald-500 text-black"
                        : "border-zinc-600 bg-zinc-900 group-hover:border-zinc-400"
                    }`}
                  >
                    {checked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() =>
                      handleCheckboxChange(fit, selectedFit, setSelectedFit)
                    }
                    className="hidden"
                  />
                  <span>{fit}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Category Section */}
      <div className="border-b border-zinc-800 pb-5">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex justify-between items-center text-sm font-semibold text-zinc-200 py-1 hover:text-emerald-400 transition-colors"
        >
          <span>Category</span>
          {openSections.category ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>
        {openSections.category && (
          <div className="mt-3 space-y-2">
            {categoryGroups.map((group) => {
              const groupCategories = categories.filter((category) => category.group === group);
              const selectedCount = groupCategories.filter((category) =>
                selectedCategory.includes(category.slug)
              ).length;
              const isOpen = openCategoryGroup === group;

              return (
                <div key={group} className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/50">
                  <button
                    type="button"
                    onClick={() => setOpenCategoryGroup(isOpen ? null : group)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-bold tracking-wide transition-colors ${
                      isOpen ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                    }`}
                  >
                    <span>{group}</span>
                    <span className="flex items-center gap-2 text-[10px] text-zinc-500">
                      {selectedCount > 0 && (
                        <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 font-bold text-black">
                          {selectedCount}
                        </span>
                      )}
                      {isOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="grid grid-cols-1 gap-1 border-t border-zinc-800 p-2">
                      {groupCategories.map((cat) => {
                        const checked = selectedCategory.includes(cat.slug);
                        return (
                          <label
                            key={cat.slug}
                            className={`flex items-center gap-2 rounded-md px-2 py-2 text-[11px] cursor-pointer transition-colors ${
                              checked ? "bg-emerald-500/10 text-emerald-300" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                handleCheckboxChange(cat.slug, selectedCategory, setSelectedCategory)
                              }
                              className="h-3.5 w-3.5 accent-emerald-500"
                            />
                            <span>{cat.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Size Section */}
      <div className="border-b border-zinc-800 pb-5">
        <button
          onClick={() => toggleSection("size")}
          className="w-full flex justify-between items-center text-sm font-semibold text-zinc-200 py-1 hover:text-emerald-400 transition-colors"
        >
          <span>Size</span>
          {openSections.size ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>
        {openSections.size && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    handleCheckboxChange(size, selectedSize, setSelectedSize)
                  }
                  className={`py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? "bg-zinc-100 text-zinc-900 border-zinc-100 font-bold shadow-sm"
                      : "bg-zinc-900/60 text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/40"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Section */}
      <div className="border-b border-zinc-800 pb-5">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex justify-between items-center text-sm font-semibold text-zinc-200 py-1 hover:text-emerald-400 transition-colors"
        >
          <span>Max Price</span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>
        {openSections.price && (
          <div className="mt-4 space-y-3">
            <input
              type="range"
              min="500"
              max="50000"
              step="500"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between items-center text-xs text-zinc-400 font-medium">
              <span>₹500</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">
                Up to ₹{priceRange}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* In Stock Toggle */}
      <div className="pt-1">
        <label className="flex items-center justify-between text-xs font-medium text-zinc-300 cursor-pointer group">
          <span className="group-hover:text-white transition-colors">
            In Stock Only
          </span>
          <div
            onClick={() => setInStockOnly(!inStockOnly)}
            className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
              inStockOnly ? "bg-emerald-500" : "bg-zinc-800"
            }`}
          >
            <div
              className={`bg-zinc-100 w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                inStockOnly ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </div>
        </label>
      </div>
    </aside>
  );
};

export default FilterSidebar;