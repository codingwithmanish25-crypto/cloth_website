'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Enter a valid email address' }),

  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
});

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    console.log('Form Data:', data);
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center bg-[#0a0a0a] text-white px-4 py-12">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-zinc-950/90 border border-zinc-800/80 p-8 rounded-xl shadow-2xl space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-wider uppercase text-white">
            Welcome Back
          </h1>
          <p className="text-xs text-zinc-400">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            className={`w-full bg-[#0a0a0a] text-white border ${
              errors.email ? 'border-red-500' : 'border-zinc-800'
            } p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none transition-colors duration-200`}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-zinc-400 hover:text-[#10b981] transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative flex items-center">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`w-full bg-[#0a0a0a] text-white border ${
                errors.password ? 'border-red-500' : 'border-zinc-800'
              } p-3 pr-10 rounded-md text-sm focus:border-[#10b981] focus:outline-none transition-colors duration-200`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-zinc-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-[#10b981]" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-500">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#10b981] text-white py-3 rounded-md text-sm font-bold tracking-wider uppercase hover:bg-[#059669] transition-colors duration-300 cursor-pointer shadow-lg shadow-[#10b981]/10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Submit'
          )}
        </button>

        <p className="text-center text-xs text-zinc-500 pt-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#10b981] hover:underline font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;