"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthTagCollage from "@/components/login/AuthTagCollage";

import { useRequestOtp } from "@/hooks/useRequestOtp";
import { useVerifyOtp } from "@/hooks/useVerifyOtp";
import { useQueryClient } from "@tanstack/react-query";

export default function Root() {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [step, setStep] = React.useState<"email" | "otp">("email");
  const [countdown, setCountdown] = React.useState(0);

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  const queryClient = useQueryClient();

  const isValidEmail = /\S+@\S+\.\S+/.test(email);

  // 🔹 Step 1: Request OTP
  const handleRequestOtp = () => {
    if (!isValidEmail || countdown > 0) return;

    requestOtp.mutate(
      { email },
      {
        onSuccess: () => {
          setStep("otp");
          setOtp("");          // 🔥 clear old OTP
          setCountdown(60);    // start timer
        },
      }
    );
  };

  // 🔹 Step 2: Verify OTP
  const handleVerifyOtp = () => {
    if (otp.length !== 6) return;

    verifyOtp.mutate(
      { email, otp },
      {
        onSuccess: (data) => {
          // 🔐 Store token
          if (data.accessToken) {
            localStorage.setItem("accessToken", data.accessToken);

            // 👤 Optional: store admin
            queryClient.setQueryData(["admin"], data.admin);
          }
          // 🚀 Redirect
          router.replace("/dashboard");
        },
      }
    );
  };

  // 🔥 Stable countdown (no stacking intervals)
  React.useEffect(() => {
    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const error = requestOtp.error || verifyOtp.error;

  return (
    <div className="min-h-screen bg-[#2200FF] flex items-center justify-center px-6">
      <div className="w-full max-w-100">
        <div className="relative bg-white rounded-3xl p-8 shadow-xl overflow-hidden">

          <div className="absolute inset-0 opacity-10 z-0 pointer-events-none top-4">
            <AuthTagCollage height={260} />
          </div>

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <Image
                src="/logos/HODL_Primary_ProtocolNavy.svg"
                alt="HODL"
                width={140}
                height={40}
                priority
              />
            </div>

            <h1 className="text-[24px] font-semibold text-gray-900 text-center mb-6">
              Welcome back:{" "}
              <span className="italic text-xl text-gray-800">
                Admin Panel
              </span>
            </h1>

            {/* Error */}
            {error && (
              <div className="mb-4 text-sm text-red-600 text-center">
                {(error as any)?.response?.data?.message ||
                  "Something went wrong"}
              </div>
            )}

            {/* EMAIL STEP */}
            {step === "email" && (
              <div className="mb-6 text-gray-600 text-sm">
                <label>Email</label>
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
            )}

            {/* OTP STEP */}
            {step === "otp" && (
              <div className="mb-6 text-gray-600 text-sm">
                <label>Enter OTP</label>

                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="123456"
                  value={otp}
                  maxLength={6}
                  onChange={(e) => {
                    const sanitized = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6);
                    setOtp(sanitized);
                  }}
                  className="mt-1 w-full rounded-[12px] border px-4 py-3 text-center tracking-widest outline-none focus:ring-2 focus:ring-[#2200FF]/20"
                />

                {/* Resend */}
                <button
                  onClick={handleRequestOtp}
                  disabled={countdown > 0 || requestOtp.isPending}
                  className={`mt-2 text-xs ${
                    countdown > 0
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-[#2200FF] underline"
                  }`}
                >
                  {countdown > 0
                    ? `Resend OTP in ${countdown}s`
                    : "Resend OTP"}
                </button>
              </div>
            )}

            {/* BUTTON */}
            <button
              onClick={
                step === "email" ? handleRequestOtp : handleVerifyOtp
              }
              disabled={
                step === "email"
                  ? !isValidEmail || requestOtp.isPending
                  : otp.length !== 6 || verifyOtp.isPending
              }
              className="w-full rounded-[20px] bg-[#2200FF] text-white py-3 text-[14px] font-medium  cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {step === "email"
                ? requestOtp.isPending
                  ? "Sending OTP..."
                  : "Send OTP"
                : verifyOtp.isPending
                ? "Verifying..."
                : "Verify OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}