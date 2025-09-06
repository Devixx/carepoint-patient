// src/components/ui/CareLoader.tsx
import React from "react";

type CareLoaderProps = {
  variant?: "full" | "inline" | "card";
  message?: string;
};

export default function CareLoader({
  variant = "full",
  message = "Loading…",
}: CareLoaderProps) {
  const spinner = (
    <div className="relative h-12 w-12">
      <svg
        className="absolute inset-0 h-12 w-12 text-blue-200"
        viewBox="0 0 48 48"
        fill="none"
      >
        <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="6" />
      </svg>
      <svg
        className="absolute inset-0 h-12 w-12 text-blue-600 animate-spin"
        viewBox="0 0 48 48"
        fill="none"
      >
        <path
          d="M44 24c0-11.046-8.954-20-20-20"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
    </div>
  );

  const dots = (
    <div className="flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.2s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.1s]" />
      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" />
    </div>
  );

  if (variant === "inline") {
    return (
      <div className="inline-flex items-center gap-3">
        {spinner}
        <span className="text-sm text-gray-600">{message}</span>
        {dots}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="p-8 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          {spinner}
          <div>
            <p className="font-medium text-gray-900">{message}</p>
            <p className="text-xs text-gray-500">Please wait a moment…</p>
          </div>
        </div>
        {dots}
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="text-center space-y-4">
        <div className="mx-auto">{spinner}</div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-800">{message}</p>
          <p className="text-xs text-gray-500">Fetching your data securely…</p>
        </div>
        <div className="flex justify-center">{dots}</div>
      </div>
    </div>
  );
}
