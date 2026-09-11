"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, Plus, LogOut, Edit2, Trash2, X, Check, AlertCircle } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

// Validation Schemas
const emailSchema = z.string().trim().email("Please enter a valid email address.");
const phoneSchema = z.string().trim().regex(/^[6-9]\d{9}$/, "Mobile number must be 10 digits starting with 6, 7, 8, or 9.");
const addressSchema = z.string().trim().min(10, "Address must be at least 10 characters long.");

const API_ENDPOINT = "/api/users/profile";

const ProfilePage = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "User",
    emails: [],
    phones: [],
    addresses: [],
  });

  const [activeModal, setActiveModal] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [validationError, setValidationError] = useState("");

  // Fetch Profile Data
  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.push("/login");
          return;
        }

        const res = await fetch(API_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserData({
            name: data.name || data.username || "User",
            emails: Array.isArray(data.emails) ? data.emails : [],
            phones: Array.isArray(data.phones) ? data.phones : [],
            addresses: Array.isArray(data.addresses) ? data.addresses : [],
          });
        } else {
          const meta = session.user.user_metadata || {};
          setUserData({
            name: meta.username || "User",
            emails: session.user.email ? [session.user.email] : [],
            phones: meta.mobile ? [meta.mobile] : [],
            addresses: meta.address ? [meta.address] : [],
          });
        }
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [router]);

  const handleOpenModal = (type, index = null, currentValue = "") => {
    setActiveModal(type);
    setEditIndex(index);
    setInputValue(currentValue);
    setValidationError("");
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setEditIndex(null);
    setInputValue("");
    setValidationError("");
  };

  // Sync state and send PUT request to API
  const updateBackend = async (key, updatedList) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const res = await fetch(API_ENDPOINT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ [key]: updatedList }),
      });

      if (!res.ok) {
        console.error("Failed to update profile in DB");
      }
    } catch (error) {
      console.error("Failed to sync profile update:", error);
    }
  };

  const handleSave = async () => {
    let result;
    if (activeModal === "email") result = emailSchema.safeParse(inputValue);
    else if (activeModal === "phone") result = phoneSchema.safeParse(inputValue);
    else if (activeModal === "address") result = addressSchema.safeParse(inputValue);

    if (result && !result.success) {
      setValidationError(result.error.issues[0].message);
      return;
    }

    const key = activeModal === "email" ? "emails" : activeModal === "phone" ? "phones" : "addresses";
    const currentList = [...userData[key]];

    if (editIndex !== null) {
      currentList[editIndex] = inputValue.trim();
    } else {
      currentList.push(inputValue.trim());
    }

    const updatedData = { ...userData, [key]: currentList };
    setUserData(updatedData);
    handleCloseModal();

    await updateBackend(key, currentList);
  };

  const handleDelete = async (type, index) => {
    const key = type === "email" ? "emails" : type === "phone" ? "phones" : "addresses";

    if (userData[key].length <= 1) {
      alert(`Minimum 1 ${type} is required!`);
      return;
    }

    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      const updatedList = userData[key].filter((_, i) => i !== index);
      const updatedData = { ...userData, [key]: updatedList };
      setUserData(updatedData);

      await updateBackend(key, updatedList);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] flex items-center justify-center text-white font-medium">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] text-white py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-[#121212] border border-[#27272a] rounded-2xl p-6 sm:p-8 shadow-xl relative">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-8 border-b border-[#27272a]">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#1e1e24] border-2 border-[#10b981] flex items-center justify-center text-3xl font-bold text-[#10b981] shadow-lg shadow-[#10b981]/10">
            {userData.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome, <span className="text-[#10b981]">{userData.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Manage your personal information and delivery addresses
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {/* Email Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</h2>
              <button onClick={() => handleOpenModal("email")} className="text-xs text-[#10b981] hover:underline flex items-center gap-1 font-medium cursor-pointer">
                <Plus className="w-3 h-3" /> Add Email
              </button>
            </div>
            <div className="space-y-2">
              {userData.emails.map((email, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 rounded-xl bg-[#18181b] border border-[#27272a]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-[#27272a] text-[#10b981] shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium text-white truncate">{email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleOpenModal("email", index, email)} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete("email", index)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phone Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mobile Number</h2>
              <button onClick={() => handleOpenModal("phone")} className="text-xs text-[#10b981] hover:underline flex items-center gap-1 font-medium cursor-pointer">
                <Plus className="w-3 h-3" /> Add Phone
              </button>
            </div>
            <div className="space-y-2">
              {userData.phones.map((phone, index) => (
                <div key={index} className="flex items-center justify-between p-3.5 rounded-xl bg-[#18181b] border border-[#27272a]">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#27272a] text-[#10b981]">
                      <Phone className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium text-white">{phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenModal("phone", index, phone)} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete("phone", index)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Address Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Shipping Address</h2>
              <button onClick={() => handleOpenModal("address")} className="text-xs text-[#10b981] hover:underline flex items-center gap-1 font-medium cursor-pointer">
                <Plus className="w-3 h-3" /> Add Address
              </button>
            </div>
            <div className="space-y-2">
              {userData.addresses.map((address, index) => (
                <div key={index} className="flex items-start justify-between p-3.5 rounded-xl bg-[#18181b] border border-[#27272a]">
                  <div className="flex items-start gap-3 flex-1 mr-3">
                    <div className="p-2 rounded-lg bg-[#27272a] text-[#10b981] mt-0.5 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium text-white leading-relaxed">{address}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleOpenModal("address", index, address)} className="p-1.5 text-gray-400 hover:text-white rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete("address", index)} className="p-1.5 text-gray-400 hover:text-red-400 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#27272a] flex justify-end">
          <button type="button" onClick={handleLogout} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#18181b] text-red-400 border border-red-500/20 hover:bg-red-500/10 font-semibold text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Edit / Add Modal */}
        {activeModal && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#121212] border border-[#27272a] w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-[#27272a]">
                <h3 className="text-base font-semibold capitalize text-white">
                  {editIndex !== null ? `Edit ${activeModal}` : `Add New ${activeModal}`}
                </h3>
                <button onClick={handleCloseModal} className="p-1 text-gray-400 hover:text-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4">
                <label className="block text-xs text-gray-400 mb-2 capitalize">Enter {activeModal}</label>
                {activeModal === "address" ? (
                  <textarea
                    rows={3}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (validationError) setValidationError("");
                    }}
                    placeholder="Enter complete full address..."
                    className={`w-full bg-[#18181b] border ${validationError ? "border-red-500" : "border-[#27272a]"} rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#10b981] resize-none`}
                  />
                ) : (
                  <input
                    type={activeModal === "email" ? "email" : "text"}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      if (validationError) setValidationError("");
                    }}
                    placeholder={activeModal === "phone" ? "Enter 10-digit mobile number..." : `Enter ${activeModal}...`}
                    className={`w-full bg-[#18181b] border ${validationError ? "border-red-500" : "border-[#27272a]"} rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#10b981]`}
                  />
                )}

                {validationError && (
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-red-400">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button onClick={handleCloseModal} className="px-4 py-2 rounded-xl bg-[#18181b] text-gray-300 text-xs font-semibold hover:bg-[#27272a]">
                  Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#10b981] text-black text-xs font-semibold hover:bg-[#0ea5e9]">
                  <Check className="w-4 h-4" /> Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;