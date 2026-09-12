"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@/components/layout/navbar.module.css";
import { Search, ShoppingCart, User, Menu, X, Plus, Minus } from "lucide-react";
import Image from "next/image";
import Cart from "../cart";
import { useCart } from "@/context/CartContext";
import { WEBSITE_CATEGORIES } from "@/lib/websiteCategories";
import { supabase } from "@/lib/supabase";

const Navbar = () => {
  // Context se cart state aur handlers consume karein
  const { isCartOpen, openCart, closeCart, cartItems } = useCart();

  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState("category");
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sessionUser, setSessionUser] = useState(null);
  const timeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  // Total dynamic item quantity calculate karein
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Screen size aur body scroll control
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsDesktop(width >= 1024);
      
      if (width >= 1024 && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    if (isMobileOpen || isCartOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "unset";
    };
  }, [isMobileOpen, isCartOpen, isSearchOpen]);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) setSessionUser(data.session?.user || null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSessionUser(session?.user || null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    searchInputRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsSearchOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) return undefined;

    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return undefined;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`/api/products?q=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (response.ok && Array.isArray(data)) setSearchResults(data);
        else setSearchResults([]);
      } catch (error) {
        if (error.name !== "AbortError") setSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [isSearchOpen, searchQuery]);

  const openSearch = () => {
    setIsSearchOpen(true);
    setIsMobileOpen(false);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const getSearchImage = (product) => {
    if (Array.isArray(product.images) && product.images[0]) return product.images[0];
    return "/placeholder.jpg";
  };

  const getSearchPrice = (product) => {
    const price = Number(product.price) || 0;
    const originalPrice = Number(product.originalPrice) || 0;
    return {
      sale: originalPrice > 0 ? Math.min(price, originalPrice) : price,
      original: originalPrice > 0 ? Math.max(price, originalPrice) : 0,
    };
  };

  const shopCategory = WEBSITE_CATEGORIES.map(({ group, items }) => ({
    title: group,
    links: items.map(([label, slug]) => ({
      label,
      slug,
      groupSlug: group.toLowerCase(),
      itemSlug: slug.replace(`${group.toLowerCase()}-`, ""),
    })),
  }));

  const shopCollection = [
    "New Arrivals",
    "Essentials",
    "Best Sellers",
    "Signature Collection",
    "Seasonal Collection",
  ];

  const policy = [
    "Return Order",
    "Privacy Policy",
    "Refund Policy",
    "Shipping Policy",
  ];

  const menuVariants = {
    hidden: { opacity: 0, y: -20, scaleY: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, scaleY: 0.95, transition: { duration: 0.15 } },
  };

  const toggleAccordion = (index) => {
    setExpandedCategory(expandedCategory === index ? null : index);
  };

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (windowWidth >= 1024) {
      setActiveMenu(menu);
    }
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 100);
  };

  return (
    <>
      <nav className="w-full bg-[#0a0a0a] shadow-sm border-b border-[#27272a] px-3 sm:px-4 md:px-6 lg:px-8 relative z-40 flex">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between h-14 sm:h-16 md:h-20 relative">
          
          {/* LEFT SECTION */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-start h-full">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden text-white p-1 focus:outline-none cursor-pointer hover:text-[#10b981] transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <ul className="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 h-full list-none m-0 p-0 text-white whitespace-nowrap">
              <li
                className={styles.navItem}
                onMouseEnter={() => handleMouseEnter("category")}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/shop_by_category">Shop By Category</Link>
                <AnimatePresence>
                  {activeMenu === "category" && windowWidth >= 1024 && (
                    <motion.div
                      className={styles.dropdownMenu}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={menuVariants}
                      onMouseEnter={() => setActiveMenu("category")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className={styles.menuContainer}>
                        <div className={styles.categoryGrid}>
                          {shopCategory.map((col, index) => (
                            <div key={index}>
                              {!col.isDirect ? (
                                <>
                                  <h4 className={styles.columnTitle}>{col.title}</h4>
                                  <div className={styles.columnList}>
                                    {col.links.map((link) => (
                                      <Link
                                        key={link.slug}
                                        href={`/category/${link.groupSlug}/${link.itemSlug}`}
                                        className={styles.dropdownLink}
                                      >
                                        {link.label}
                                      </Link>
                                    ))}
                                  </div>
                                </>
                              ) : (
                                <div className="flex flex-col gap-3">
                                  {col.links.map((link) => (
                                    <Link
                                      key={link.slug}
                                      href={`/category/${link.groupSlug}/${link.itemSlug}`}
                                      className={styles.collectionLink}
                                    >
                                      {link.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li
                className={styles.navItem}
                onMouseEnter={() => handleMouseEnter("collection")}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/shop_by_collection">Shop By Collection</Link>
                <AnimatePresence>
                  {activeMenu === "collection" && windowWidth >= 1024 && (
                    <motion.div
                      className={styles.dropdownMenu}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={menuVariants}
                      onMouseEnter={() => setActiveMenu("collection")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className={styles.menuContainer}>
                        <div className={styles.collectionGrid}>
                          {shopCollection.map((item) => (
                            <Link
                              key={item}
                              href={`/shop_by_collection/${item.toLowerCase().replace(/\s+/g, "-")}`}
                              className={styles.collectionLink}
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li className={styles.navItem}>
                <Link href="/sales">Sale</Link>
              </li>

              <li
                className={styles.navItem}
                onMouseEnter={() => handleMouseEnter("policy")}
                onMouseLeave={handleMouseLeave}
              >
                <Link href="/policy">Policy</Link>
                <AnimatePresence>
                  {activeMenu === "policy" && windowWidth >= 1024 && (
                    <motion.div
                      className={styles.dropdownMenu}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={menuVariants}
                      onMouseEnter={() => setActiveMenu("policy")}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className={styles.menuContainer}>
                        <div className={styles.collectionGrid}>
                          {policy.map((item) => (
                            <Link
                              key={item}
                              href={`/policy/${item.toLowerCase().replace(/\s+/g, "-")}`}
                              className={styles.collectionLink}
                            >
                              {item}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>

              <li className={styles.navItem}>
                <Link href="/contact-us">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* CENTER SECTION */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:flex lg:items-center lg:justify-center shrink-0">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/images.png"
                alt="Logo"
                width={100}
                height={25}
                className="max-h-5 sm:max-h-7 md:max-h-10 lg:max-h-12 w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2 md:gap-3 lg:gap-5 xl:gap-6 flex-1 h-full text-white">
            <button
              onClick={openSearch}
              className="p-1 hover:text-[#10b981] transition-colors focus:outline-none cursor-pointer" 
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {sessionUser ? (
              <Link href="/profile" className="p-1 hover:text-[#10b981] transition-colors" aria-label="Profile">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link
                  href="/login"
                  className="rounded-md border border-zinc-700 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-zinc-200 transition-colors hover:border-emerald-500 hover:text-emerald-400 sm:px-3 sm:text-[10px]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-emerald-500 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider text-black transition-colors hover:bg-emerald-400 sm:px-3 sm:text-[10px]"
                >
                  Register
                </Link>
              </div>
            )}
            
            {/* CART BUTTON WITH CONTEXT TRIGGER AND REAL-TIME COUNTER */}
            <button 
              onClick={openCart}
              className="p-1 hover:text-[#10b981] transition-colors relative focus:outline-none cursor-pointer" 
              aria-label="Cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#10b981] text-white text-[8px] sm:text-[10px] rounded-full min-w-[16px] sm:min-w-[18px] h-4 sm:h-[18px] flex items-center justify-center px-1 font-bold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close search"
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 cursor-default"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeSearch}
            />
            <motion.section
              className="fixed top-14 sm:top-16 md:top-20 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-2xl bg-white text-zinc-900 rounded-b-xl shadow-2xl z-50 overflow-hidden"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-label="Search products"
            >
              <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-3">
                <Search className="w-5 h-5 text-zinc-500 shrink-0" />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                  type="search"
                  autoComplete="off"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  className="p-1 text-zinc-500 hover:text-zinc-900"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {searchQuery.trim() ? (
                <div className="max-h-[65vh] overflow-y-auto p-3">
                  <div className="flex items-center justify-between px-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                    <span>{isSearching ? "Searching" : "Products"}</span>
                    {!isSearching && searchResults.length > 0 && <span>{searchResults.length} results</span>}
                  </div>
                  {isSearching ? (
                    <p className="px-1 py-8 text-center text-sm text-zinc-500">Searching products...</p>
                  ) : searchResults.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {searchResults.map((product) => {
                        const prices = getSearchPrice(product);
                        return (
                          <Link
                            key={String(product.id)}
                            href={`/product/${encodeURIComponent(product.slug)}`}
                            onClick={closeSearch}
                            className="group min-w-0"
                          >
                            <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
                              <Image
                                src={getSearchImage(product)}
                                alt={product.title}
                                fill
                                sizes="(max-width: 640px) 42vw, 140px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                unoptimized={getSearchImage(product).startsWith("http")}
                              />
                              {product.isSoldOut && (
                                <span className="absolute left-1 top-1 bg-black/80 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white">
                                  SOLD OUT
                                </span>
                              )}
                            </div>
                            <h3 className="mt-2 truncate text-[11px] font-semibold uppercase">{product.title}</h3>
                            <div className="flex items-center gap-1 text-[10px]">
                              <span className="font-bold">₹{prices.sale.toLocaleString("en-IN")}</span>
                              {prices.original > prices.sale && (
                                <span className="text-zinc-400 line-through">₹{prices.original.toLocaleString("en-IN")}</span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="px-1 py-8 text-center text-sm text-zinc-500">No products found.</p>
                  )}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-sm text-zinc-500">
                  Search by product name, fit, or description
                </div>
              )}
            </motion.section>
          </>
        )}
      </AnimatePresence>

      {/* MOBILE OVERLAY SIDEBAR DRAWER */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[340px] sm:max-w-[360px] bg-[#ffffff] text-[#0a0a0a] z-50 flex flex-col shadow-2xl overflow-y-auto"
            >
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
                <Link href="/" onClick={() => setIsMobileOpen(false)} className="flex items-center">
                  <Image
                    src="/images.png"
                    alt="Logo"
                    width={70}
                    height={18}
                    className="max-h-5 sm:max-h-6 w-auto object-contain"
                  />
                </Link>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1 text-black hover:opacity-70"
                  aria-label="Close Menu"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="flex border-b border-gray-200 text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-gray-50 p-1 gap-1">
                <button
                  onClick={() => setMobileTab("category")}
                  className={`flex-1 py-2 sm:py-2.5 text-center transition-all rounded ${
                    mobileTab === "category"
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Category
                </button>
                <button
                  onClick={() => setMobileTab("collection")}
                  className={`flex-1 py-2 sm:py-2.5 text-center transition-all rounded ${
                    mobileTab === "collection"
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Collection
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {mobileTab === "category" && (
                  <div className="flex flex-col">
                    {shopCategory.map((cat, idx) => (
                      <div key={idx} className="border-b border-gray-100">
                        {!cat.isDirect ? (
                          <>
                            <button
                              onClick={() => toggleAccordion(idx)}
                              className="w-full flex items-center justify-between px-4 sm:px-5 py-3 sm:py-3.5 text-sm font-medium text-left text-gray-800 hover:bg-gray-50"
                            >
                              <span className="text-xs sm:text-sm">{cat.title}</span>
                              {expandedCategory === idx ? (
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                              ) : (
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                              )}
                            </button>

                            <AnimatePresence>
                              {expandedCategory === idx && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden bg-gray-50/60 px-5 sm:px-6"
                                >
                                  {cat.links.map((link) => (
                                    <Link
                                      key={link.slug}
                                      href={`/category/${link.groupSlug}/${link.itemSlug}`}
                                      onClick={() => setIsMobileOpen(false)}
                                      className="block py-2 sm:py-2.5 text-[11px] sm:text-xs text-gray-600 hover:text-black border-b border-gray-100 last:border-0"
                                    >
                                      {link.label}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <div className="py-1">
                            {cat.links.map((link) => (
                              <Link
                                key={link}
                                href={`/category/${link.toLowerCase().replace(/\s+/g, "-")}`}
                                onClick={() => setIsMobileOpen(false)}
                                className="block px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-800 hover:bg-gray-50"
                              >
                                {link}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {mobileTab === "collection" && (
                  <div className="flex flex-col py-1">
                    {shopCollection.map((item) => (
                      <Link
                        key={item}
                        href={`/shop_by_collection/${item.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setIsMobileOpen(false)}
                        className="px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-800 hover:bg-gray-50 border-b border-gray-100"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-4 border-t border-gray-200 pt-2">
                  {sessionUser ? (
                    <Link
                      href="/profile"
                      onClick={() => setIsMobileOpen(false)}
                      className="block px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    >
                      My Profile
                    </Link>
                  ) : (
                    <div className="flex gap-2 px-4 py-3 sm:px-5">
                      <Link href="/login" onClick={() => setIsMobileOpen(false)} className="flex-1 border border-gray-300 px-3 py-2 text-center text-xs font-semibold text-gray-800">Login</Link>
                      <Link href="/register" onClick={() => setIsMobileOpen(false)} className="flex-1 bg-black px-3 py-2 text-center text-xs font-semibold text-white">Register</Link>
                    </div>
                  )}
                  <Link
                    href="/sales"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-red-600 hover:bg-gray-50"
                  >
                    Sale
                  </Link>
                  <Link
                    href="/policy"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Policy
                  </Link>
                  <Link
                    href="/contact-us"
                    onClick={() => setIsMobileOpen(false)}
                    className="block px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SIDE CART DRAWER COMPONENT */}
      <Cart />
    </>
  );
};

export default Navbar;