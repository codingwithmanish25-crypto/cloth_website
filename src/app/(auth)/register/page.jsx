'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const RegisterSchema = z
  .object({
    email: z
      .string()
      .trim()
      .min(1, { message: 'Email is required' })
      .email({ message: 'Enter a valid email address' }),

    mobile: z
      .string()
      .trim()
      .min(1, { message: 'Mobile number is required' })
      .regex(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit Indian mobile number' }),

    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Must contain at least one number' })
      .regex(/[@$!%*?&]/, { message: 'Must contain at least one special character (@, $, !, %, *, ?, &)' }),

    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm Password is required' }),

    address: z
      .string()
      .trim()
      .min(1, { message: 'Address is required' })
      .min(10, { message: 'Address must be at least 10 characters long' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit = (data) => {
    console.log('Form Submitted Data:', data);
    // Yahan API Call karein
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
            Enter your credentials to access your account
          </p>
        </div>

        {/* Email Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">
            Email
          </label>   
          <input 
            type="email"
            placeholder="Enter Your Email Address"
            {...register('email')}
            className={`w-full bg-[#0a0a0a] text-white border ${
              errors.email ? 'border-red-500' : 'border-zinc-800'
            } p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none transition-colors duration-200`}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Mobile Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">
            Mobile
          </label>   
          <input 
            type="text"
            placeholder="Enter Your Mobile Number"
            {...register('mobile')}
            className={`w-full bg-[#0a0a0a] text-white border ${
              errors.mobile ? 'border-red-500' : 'border-zinc-800'
            } p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none transition-colors duration-200`}
          />
          {errors.mobile && (
            <p className="text-xs text-red-500">{errors.mobile.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">
            Password
          </label>   
          <div className="relative flex items-center">
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Enter a password"
              {...register('password')}
              className={`w-full bg-[#0a0a0a] text-white border ${
                errors.password ? 'border-red-500' : 'border-zinc-800'
              } p-3 pr-10 rounded-md text-sm focus:border-[#10b981] focus:outline-none transition-colors duration-200`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-zinc-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
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

        {/* Confirm Password Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">
            Confirm Password
          </label>   
          <div className="relative flex items-center">
            <input 
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter your password"
              {...register('confirmPassword')}
              className={`w-full bg-[#0a0a0a] text-white border ${
                errors.confirmPassword ? 'border-red-500' : 'border-zinc-800'
              } p-3 pr-10 rounded-md text-sm focus:border-[#10b981] focus:outline-none transition-colors duration-200`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 text-zinc-400 hover:text-white transition-colors cursor-pointer focus:outline-none"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-[#10b981]" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="space-y-1">
          <label className="text-xs font-semibold tracking-wider text-zinc-300 uppercase block">
            Address
          </label>   
          <textarea 
            rows={3}
            placeholder="Enter Your Address"
            {...register('address')}
            className={`w-full bg-[#0a0a0a] text-white border ${
              errors.address ? 'border-red-500' : 'border-zinc-800'
            } p-3 rounded-md text-sm focus:border-[#10b981] focus:outline-none transition-colors duration-200`}
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#10b981] text-white py-3 rounded-md text-sm font-bold tracking-wider uppercase hover:bg-[#059669] transition-colors duration-300 cursor-pointer shadow-lg shadow-[#10b981]/10 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        <p className="text-center text-xs text-zinc-500 pt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-[#10b981] hover:underline font-semibold">
            Log In
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;