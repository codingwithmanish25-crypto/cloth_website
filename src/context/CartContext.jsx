"use client";

import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Initial state me cartItemId properly format kar diya gaya hai
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      cartItemId: "1-XXL",
      title: "Sunflower Beige Shirt",
      color: "Beige",
      size: "XXL",
      price: 4398,
      quantity: 2,
      image:
        "/homesection/relaxedfit-collection_tile_238x238_f18634bf-7396-427f-9c1f-f932ab2ba3b6.webp",
    },
  ]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product, selectedSize) => {
    // Standardize unique ID per product variant (ID + Size)
    const size = selectedSize || product.size || "Free Size";
    const key = `${product.id}-${size}`;

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => (item.cartItemId || item.id) === key || (item.id === product.id && item.size === size)
      );

      if (existingItemIndex > -1) {
        return prevItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          cartItemId: key,
          size: size,
          quantity: 1,
        },
      ];
    });

    openCart();
  };

  const updateQuantity = (cartItemId, delta) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (item.cartItemId === cartItemId || item.id === cartItemId) {
            const newQty = item.quantity + delta;
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