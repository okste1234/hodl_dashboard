"use client";

import React from "react";
import Image from "next/image";

type AuthTagCollageProps = {
  variant?: "finance" | "crypto";
  height?: number; // px
  className?: string;
};

export default function AuthTagCollage({ variant = "crypto", height = 180, className }: AuthTagCollageProps) {
  return (
    <div
      className={`relative w-full max-w-90 mx-auto overflow-hidden select-none ${className ?? ""}`}
      style={{ height, transform: "translateZ(0)" }}
      aria-hidden="true"
    >
      <div className="h-full w-full flex items-center justify-center">
        <Image
          src="/auth.svg"
          alt="Auth Illustration"
          width={146}
          height={234}
          className="h-full w-auto"
          priority={false}
        />
      </div>
    </div>
  );
}


