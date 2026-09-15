"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { supabase } from "@/lib/supabase";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setHasRecoverySession(Boolean(data.session));
        setCheckingSession(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
          setHasRecoverySession(Boolean(session));
          setCheckingSession(false);
        }
      },
    );

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const onSubmit = async ({ password }) => {
    setApiError("");

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setApiError(error.message);
        return;
      }

      router.push("/login?reset=success");
    } catch (error) {
      console.error("Reset password error:", error);
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
            Reset Password
          </h1>
          <p className="text-xs text-zinc-400">
            Choose a new password for your account.
          </p>
        </div>

        {checkingSession ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-[#10b981]" />
          </div>
        ) : !hasRecoverySession ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-zinc-300">
              This reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="block text-sm text-[#10b981] hover:underline font-semibold"
            >
              Request a new reset link
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
                htmlFor="password"
                className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block"
              >
                New password
              </label>
              <input
                id="password"
                {...register("password")}
                type="password"
                autoComplete="new-password"
                placeholder="Enter a new password"
                className={`w-full bg-[#0a0a0a] text-white border ${
                  errors.password ? "border-red-500" : "border-zinc-800"
                } p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none`}
              />
              {errors.password && (
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block"
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                {...register("confirmPassword")}
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                className={`w-full bg-[#0a0a0a] text-white border ${
                  errors.confirmPassword ? "border-red-500" : "border-zinc-800"
                } p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none`}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#10b981] text-white py-3 rounded-md text-sm font-bold tracking-wider uppercase hover:bg-[#059669] transition-colors duration-300 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update password"
              )}
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ResetPasswordPage;
