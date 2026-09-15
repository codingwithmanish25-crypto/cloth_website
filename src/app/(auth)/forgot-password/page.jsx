"use client";

import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { supabase } from "@/lib/supabase";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: "Email is required" })
    .email({ message: "Enter a valid email address" }),
});

const ForgotPasswordPage = () => {
  const [apiError, setApiError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async ({ email }) => {
    setApiError("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setApiError(error.message);
        return;
      }

      setEmailSent(true);
    } catch (error) {
      console.error("Forgot password error:", error);
      setApiError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center bg-[#0a0a0a] text-white px-4 py-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-zinc-950/90 border border-zinc-800/80 p-8 rounded-xl shadow-2xl space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-wider uppercase">
            Forgot Password
          </h1>
          <p className="text-xs text-zinc-400">
            Enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        {emailSent ? (
          <div className="space-y-4 text-center">
            <MailCheck className="mx-auto h-10 w-10 text-[#10b981]" />
            <p className="text-sm text-zinc-300">
              If an account exists for that email, a password reset link has
              been sent.
            </p>
            <Link
              href="/login"
              className="block text-sm text-[#10b981] hover:underline font-semibold"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <>
            {apiError && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-400 text-xs text-center">
                {apiError}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block"
              >
                Email
              </label>
              <input
                id="email"
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="Enter your email address"
                className={`w-full bg-[#0a0a0a] text-white border ${
                  errors.email ? "border-red-500" : "border-zinc-800"
                } p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none`}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#10b981] text-white py-3 rounded-md text-sm font-bold tracking-wider uppercase hover:bg-[#059669] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                "Send reset link"
              )}
            </button>

            <p className="text-center text-xs text-zinc-500 pt-2">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="text-[#10b981] hover:underline font-semibold"
              >
                Log in
              </Link>
            </p>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
