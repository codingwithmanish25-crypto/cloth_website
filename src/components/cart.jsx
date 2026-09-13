"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, Trash2, Plus, Minus, Tag, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const Cart = () => {
  const router = useRouter();
  const {
    isCartOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeFromCart,
    appliedCoupons,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  const [checkoutBusy, setCheckoutBusy] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = Math.min(
    subtotal,
    appliedCoupons.reduce((totalDiscount, coupon) => {
      const couponDiscount = coupon.discountType === "PERCENTAGE"
        ? (subtotal * coupon.discountValue) / 100
        : coupon.discountValue;
      return totalDiscount + Math.min(subtotal, couponDiscount);
    }, 0)
  );
  const total = Math.max(0, subtotal - discount);

  useEffect(() => {
    if (!isCouponOpen) return;
    fetch("/api/coupons")
      .then((response) => response.json())
      .then((data) => setCoupons(Array.isArray(data) ? data : []))
      .catch(() => setCoupons([]));
  }, [isCouponOpen]);

  const handleApplyCoupon = async (code) => {
    setCouponBusy(true);
    const result = await applyCoupon(code, subtotal);
    setCouponBusy(false);
    if (result) {
      setCouponCode("");
      setIsCouponOpen(false);
    }
  };

  const openCheckout = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/login?redirect=/"); return; }
    setCheckoutError("");
    const response = await fetch("/api/users/profile", { headers: { Authorization: `Bearer ${session.access_token}` } });
    const data = await response.json();
    if (!response.ok) { setCheckoutError(data.error || "Could not load addresses"); return; }
    const savedAddresses = Array.isArray(data.addresses) ? data.addresses : [];
    setAddresses(savedAddresses); setSelectedAddress(savedAddresses[0] || ""); setIsCheckoutOpen(true);
  };

  const saveNewAddress = async () => {
    const value = newAddress.trim();
    if (value.length < 10) { setCheckoutError("Please enter a complete address"); return; }
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch("/api/users/profile", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` }, body: JSON.stringify({ addresses: [...addresses, value] }) });
    if (!response.ok) { setCheckoutError("Could not save address"); return; }
    setAddresses((current) => [...current, value]); setSelectedAddress(value); setNewAddress(""); setCheckoutError("");
  };

  const startPayment = async () => {
    if (!selectedAddress) { setCheckoutError("Select or add a delivery address"); return; }
    setCheckoutBusy(true); setCheckoutError("");
    try {
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!key) throw new Error("Razorpay key is not configured");
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => { const script = document.createElement("script"); script.src = "https://checkout.razorpay.com/v1/checkout.js"; script.onload = resolve; script.onerror = () => reject(new Error("Payment gateway could not load")); document.body.appendChild(script); });
      }
      const payment = new window.Razorpay({ key, amount: Math.round(total * 100), currency: "INR", name: "Cloth Website", description: "Order payment", handler: async (result) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setCheckoutError("Your login session expired. Please log in again.");
          return;
        }

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ items: cartItems.map(({ id, title, price, quantity, size }) => ({ id, title, price, quantity, size })), subtotal, discount, total, address: selectedAddress, paymentId: result.razorpay_payment_id }),
        });
        if (!response.ok) { setCheckoutError("Payment succeeded but order could not be saved. Contact support."); return; }
        setIsCheckoutOpen(false); closeCart(); alert("Payment successful. Your order is pending confirmation.");
      }, theme: { color: "#f97316" } });
      payment.open();
    } catch (error) { setCheckoutError(error.message); } finally { setCheckoutBusy(false); }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <aside className="relative w-full max-w-[420px] bg-zinc-950 text-white h-full flex flex-col z-10 shadow-2xl border-l border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <button
            onClick={closeCart}
            className="p-1 hover:bg-zinc-800 rounded-full transition text-zinc-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-white tracking-wide uppercase">
            Your Bag ({totalItems})
          </h2>
          <div className="w-6" />
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto space-y-5">
          {/* Cart Items */}
          <div className="px-4 space-y-4">
            {cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div key={item.cartItemId || item.id} className="flex gap-3 pb-4 border-b border-zinc-800">
                  <div className="relative w-20 h-24 bg-zinc-900 rounded overflow-hidden shrink-0">
                    <Image
                      src={item.image || item.images?.[0] || "/placeholder.jpg"}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                      unoptimized={(item.image || item.images?.[0] || "").startsWith("http")}
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-semibold text-zinc-100 line-clamp-1">
                          {item.title}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.cartItemId || item.id)}
                          className="text-zinc-500 hover:text-red-400 p-0.5 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-0.5">Size: {item.size}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-zinc-700 rounded px-1 py-0.5 bg-zinc-900">
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.id, -1)}
                          className="px-1.5 py-0.5 text-zinc-400 hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId || item.id, 1)}
                          className="px-1.5 py-0.5 text-zinc-400 hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-bold text-white">
                        ₹ {(Number(item.price) * item.quantity).toLocaleString("en-IN")}.00
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-zinc-500 text-xs">
                Your bag is empty.
              </div>
            )}
          </div>

          {/* Coupons Bar */}
          <div className="px-4">
            <button
              onClick={() => setIsCouponOpen(true)}
              className="w-full flex items-center justify-between p-3 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 transition text-xs font-medium text-zinc-200"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-orange-500" />
                <span>{appliedCoupons.length ? `${appliedCoupons.length} coupon${appliedCoupons.length > 1 ? "s" : ""} applied` : "Apply Coupons"}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-500" />
            </button>
            {appliedCoupons.length > 0 && (
              <div className="mt-2 space-y-1">
                {appliedCoupons.map((coupon) => (
                  <div key={coupon.id} className="flex items-center justify-between text-[11px] text-emerald-400">
                    <span>{coupon.code} applied</span>
                    <button onClick={() => removeCoupon(coupon.id)} className="text-red-400 hover:text-red-300">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-sm font-bold text-white">
              ₹ {subtotal.toLocaleString("en-IN")}.00
            </span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between mb-3 text-xs text-emerald-400">
              <span>Discount ({appliedCoupons.length} coupon{appliedCoupons.length > 1 ? "s" : ""})</span>
              <span>- ₹ {discount.toLocaleString("en-IN")}.00</span>
            </div>
          )}
          <div className="flex items-center justify-between mb-3 text-sm font-bold">
            <span>Total</span>
            <span>₹ {total.toLocaleString("en-IN")}.00</span>
          </div>
          <button onClick={openCheckout} disabled={!cartItems.length} className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold py-3.5 rounded uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition disabled:cursor-not-allowed disabled:opacity-40">
            <span>Proceed to Buy</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-950 p-5 text-white">
            <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-bold uppercase">Delivery address</h3><button onClick={() => setIsCheckoutOpen(false)} className="text-zinc-400">×</button></div>
            <div className="space-y-2">{addresses.map((address) => <label key={address} className="flex gap-3 rounded border border-zinc-800 p-3 text-xs"><input type="radio" name="address" checked={selectedAddress === address} onChange={() => setSelectedAddress(address)} className="accent-orange-500" /><span>{address}</span></label>)}</div>
            <div className="mt-4 flex gap-2"><textarea value={newAddress} onChange={(event) => setNewAddress(event.target.value)} rows={2} placeholder="Add another complete address" className="min-w-0 flex-1 rounded border border-zinc-700 bg-zinc-900 p-2 text-xs" /><button onClick={saveNewAddress} className="self-end rounded bg-zinc-800 px-3 py-2 text-xs">Add address</button></div>
            {checkoutError && <p className="mt-3 text-xs text-red-400">{checkoutError}</p>}
            <button onClick={startPayment} disabled={checkoutBusy || !selectedAddress} className="mt-5 w-full rounded bg-orange-600 py-3 text-xs font-bold uppercase text-black disabled:opacity-40">{checkoutBusy ? "Opening payment..." : `Pay ₹${total.toLocaleString("en-IN")}`}</button>
          </div>
        </div>
      )}

      {isCouponOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-950 p-5 text-white shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider">Apply Coupon</h3>
              <button onClick={() => setIsCouponOpen(false)} className="text-zinc-400 hover:text-white">×</button>
            </div>
            <div className="mb-4 flex gap-2">
              <input
                value={couponCode}
                onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="min-w-0 flex-1 rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs outline-none focus:border-orange-500"
              />
              <button
                disabled={!couponCode.trim() || couponBusy}
                onClick={() => handleApplyCoupon(couponCode)}
                className="rounded bg-orange-600 px-4 py-2 text-xs font-bold text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                Apply
              </button>
            </div>
            {couponError && <p className="mb-3 text-xs text-red-400">{couponError}</p>}
            <div className="space-y-2">
              {coupons.length > 0 ? coupons.map((coupon) => (
                <div key={coupon.id} className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-900 p-3">
                  <div>
                    <p className="text-xs font-bold text-orange-400">{coupon.code}</p>
                    <p className="mt-1 text-[10px] text-zinc-400">
                      {coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                      {coupon.minOrderValue > 0 && ` on orders above ₹${coupon.minOrderValue}`}
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-500">Valid till {new Date(coupon.expiresAt).toLocaleString("en-IN")}</p>
                  </div>
                  <button
                    disabled={couponBusy}
                    onClick={() => handleApplyCoupon(coupon.code)}
                    className="rounded border border-orange-500 px-3 py-1.5 text-[10px] font-bold text-orange-400 hover:bg-orange-500 hover:text-black disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              )) : <p className="py-5 text-center text-xs text-zinc-500">No active coupons right now.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;