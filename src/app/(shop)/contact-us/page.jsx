"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Send, AlertCircle, CheckCircle2 } from "lucide-react";
import { z } from "zod";

// Zod Validation Schema
const contactSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long."),
});

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field-specific error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Submit Handler with Zod Validation
  const handleSubmit = (e) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      // Format Zod Errors
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0]] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    // Success State
    setErrors({});
    setIsSubmitted(true);
    setFormData({ email: "", message: "" });

    // Hide success message after 4 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0a0a0a] text-white py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-lg bg-[#121212] border border-[#27272a] rounded-2xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Header */}
        <div className="text-center pb-6 border-b border-[#27272a]">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Please <span className="text-[#10b981]">Contact Now</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Have questions or feedback? Send us a message and we'll reply soon.
          </p>
        </div>

        {/* Success Alert */}
        {isSubmitted && (
          <div className="mt-6 flex items-center gap-2.5 p-3.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl text-[#10b981] text-xs sm:text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Thank you! Your message has been sent successfully.</span>
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          
          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your Email"
                className={`w-full bg-[#18181b] border ${
                  errors.email ? "border-red-500" : "border-[#27272a]"
                } rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] transition-colors`}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          {/* Message Field */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Message
            </label>
            <div className="relative">
              <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none text-gray-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your message here..."
                className={`w-full bg-[#18181b] border ${
                  errors.message ? "border-red-500" : "border-[#27272a]"
                } rounded-xl pl-10 pr-3.5 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#10b981] transition-colors resize-none`}
              />
            </div>
            {errors.message && (
              <div className="flex items-center gap-1.5 text-xs text-red-400 mt-0.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.message}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#10b981] text-black font-semibold text-sm hover:bg-[#0ea5e9] transition-all cursor-pointer shadow-md active:scale-[0.99] mt-2"
          >
            <Send className="w-4 h-4" />
            Send Message
          </button>
        </form>

      </div>
    </div>
  );
};

export default Contact;