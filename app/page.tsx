"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthTagCollage from "@/components/login/AuthTagCollage";
import { useLogin } from "@/hooks/useLogin";

export default function Root() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const { mutate, isPending, error } = useLogin();

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  const handleLogin = () => {
    if (!isValidEmail || !password) return;

    mutate({
      email,
      isEmailVerified: true, // 👈 matches your backend expectation
    });
  };



  return (
    <div className="min-h-screen bg-[#2200FF] flex items-center justify-center px-6">
      <div className="w-full max-w-100">
        
        {/* Card */}
        <div className="relative bg-white rounded-3xl p-8 shadow-xl overflow-hidden">

          {/* 🔥 Collage Background */}
          <div className="absolute inset-0 opacity-10 z-0 pointer-events-none top-4">
            <AuthTagCollage
              height={260}
              className=""
            />
          </div>

          {/* Content */}
          <div className="relative z-10">

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/logos/HODL_Primary_ProtocolNavy.svg"
                alt="HODL"
                width={140}
                height={40}
                // className="invert"
                priority
              />
            </div>

            {/* Title */}
            <h1 className="text-[24px] font-semibold text-gray-900 text-center mb-6">
              Welcome back: <span className="italic text-xl text-gray-800">Admin Panel</span>
            </h1>

            {/* Error */}
            {error && (
              <div className="mb-4 text-sm text-red-600 text-center">
                {(error as any)?.response?.data?.message ||
                  "Login failed"}
              </div>
            )}

            {/* Email */}
            <div className="mb-4 text-gray-600 text-sm">
              <label className="">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-[12px] border px-4 py-3 outline-none focus:ring-2 focus:ring-[#2200FF]/20"
              />
              {!isValidEmail && email && (
                <p className="text-red-500 text-xs mt-1">
                  Enter a valid email
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6 text-gray-600 text-sm">
              <label className="">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-[12px] border px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#2200FF]/20"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleLogin}
              disabled={!isValidEmail || !password || isPending}
              className="w-full rounded-[20px] bg-[#2200FF] text-white py-3 text-[14px] font-medium disabled:opacity-60"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}