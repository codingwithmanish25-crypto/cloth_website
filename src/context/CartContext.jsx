"use client";

import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [cartItems, setCartItems] = useState([]);
  const [appliedCoupons, setAppliedCoupons] = useState([]);
  const [couponError, setCouponError] = useState("");

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, selectedSize) => {
    if (Number(product.stock) <= 0 || product.isSoldOut) return false;
    // Standardize unique ID per product variant (ID + Size)
    const size = selectedSize || product.size || "Free Size";
    const key = `${product.id}-${size}`;
    const price = Number(product.price) || 0;
    const originalPrice = Number(product.originalPrice) || 0;
    const salePrice = originalPrice > 0 ? Math.min(price, originalPrice) : price;
    const image = product.image || (Array.isArray(product.images) ? product.images[0] : null);

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => (item.cartItemId || item.id) === key || (item.id === product.id && item.size === size)
      );

      if (existingItemIndex > -1) {
        const existingItem = prevItems[existingItemIndex];
        if (existingItem.quantity >= Number(product.stock)) return prevItems;
        return prevItems.map((item, index) =>
          index === existingItemIndex
              ? { ...item, price: salePrice, image, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          price: salePrice,
          image,
          cartItemId: key,
          size: size,
          quantity: 1,
        },
      ];
    });

    openCart();
    return true;
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.cartItemId === cartItemId || item.id === cartItemId) {
            const newQty = item.quantity + delta;
            if (delta > 0 && newQty > Number(item.stock)) return item;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (cartItemId) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => item.cartItemId !== cartItemId && item.id !== cartItemId
      )
    );
  };

  const applyCoupon = async (code, subtotal) => {
    setCouponError("");
    try {
      const response = await fetch("/api/coupons/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Coupon could not be applied");
      setAppliedCoupons((currentCoupons) => {
        if (currentCoupons.some((coupon) => coupon.id === result.id)) {
          setCouponError("This coupon is already applied");
          return currentCoupons;
        }
        return [...currentCoupons, result];
      });
      return result;
    } catch (error) {
      setCouponError(error.message);
      return null;
    }
  };

  const removeCoupon = (couponId) => {
    setAppliedCoupons((currentCoupons) =>
      currentCoupons.filter((coupon) => coupon.id !== couponId)
    );
    setCouponError("");
  };

  return (
    <CartContext.Provider
      value={{
        isCartOpen,
        openCart,
        closeCart,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        appliedCoupons,
        couponError,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};