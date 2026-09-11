'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/lib/supabase';

const RegisterSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, { message: 'Username must be at least 3 characters long' }),

    email: z
      .string()
      .trim()
      .email({ message: 'Enter a valid email address' }),

    mobile: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit mobile number' }),

    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' }),

    confirmPassword: z.string(),

    address: z
      .string()
      .trim()
      .min(10, { message: 'Address must be at least 10 characters long' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = async (data) => {
    setApiError('');
    try {
      // 1. Supabase Auth Registration
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
            mobile: data.mobile,
            address: data.address,
            role: 'user', // Default role for registering users
          },
        },
      });

      if (error) {
        setApiError(error.message);
        return;
      }

      // 2. Redirect User to Login Page
      router.push('/login');
    } catch (err) {
      console.error('Registration Error:', err);
      setApiError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center bg-[#0a0a0a] text-white px-4 py-12">
      <form 
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-zinc-950/90 border border-zinc-800/80 p-8 rounded-xl shadow-2xl space-y-5"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-wider uppercase text-white">
            Create an Account
          </h1>
          <p className="text-xs text-zinc-400">
            Powered by Supabase Authentication
          </p>
        </div>

        {apiError && (
          <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-400 text-xs text-center">
            {apiError}
          </div>
        )}

        {/* Username */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">Username</label>   
          <input 
            type="text"
            placeholder="Enter Your Username"
            {...register('username')}
            className="w-full bg-[#0a0a0a] text-white border border-zinc-800 p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none"
          />
          {errors.username && <p className="text-xs text-red-500">{errors.username.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">Email</label>   
          <input 
            type="email"
            placeholder="Enter Your Email Address"
            {...register('email')}
            className="w-full bg-[#0a0a0a] text-white border border-zinc-800 p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Mobile */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">Mobile</label>   
          <input 
            type="text"
            placeholder="Enter Your Mobile Number"
            {...register('mobile')}
            className="w-full bg-[#0a0a0a] text-white border border-zinc-800 p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none"
          />
          {errors.mobile && <p className="text-xs text-red-500">{errors.mobile.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">Password</label>   
          <div className="relative flex items-center">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Enter a password"
              {...register('password')}
              className="w-full bg-[#0a0a0a] text-white border border-zinc-800 p-3 pr-10 rounded-md text-sm focus:border-[#10b981] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-zinc-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5 text-[#10b981]" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">Confirm Password</label>   
          <div className="relative flex items-center">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              {...register('confirmPassword')}
              className="w-full bg-[#0a0a0a] text-white border border-zinc-800 p-3 pr-10 rounded-md text-sm focus:border-[#10b981] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-zinc-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5 text-[#10b981]" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
        </div>

        {/* Address */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">Address</label>   
          <textarea 
            rows={3}
            placeholder="Enter Your Address"
            {...register('address')}
            className="w-full bg-[#0a0a0a] text-white border border-zinc-800 p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none"
          />
          {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#10b981] text-white py-3 rounded-md text-sm font-bold tracking-wider uppercase hover:bg-[#059669] transition-colors duration-300 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Registering...</> : 'Submit'}
        </button>

        <p className="text-center text-xs text-zinc-500 pt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-[#10b981] hover:underline font-semibold">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;