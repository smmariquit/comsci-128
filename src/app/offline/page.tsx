"use client";

import { WifiOff } from "lucide-react";


export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-[#1C2632] flex items-center justify-center mx-auto mb-6">
          <WifiOff size={36} className="text-[#C9642A]" />
        </div>
        <h1 className="text-2xl font-bold text-[#1C2632] mb-3 font-[family-name:var(--font-geist-sans)]">
          You&apos;re Offline
        </h1>
        <p className="text-[#1C2632]/60 mb-6 font-[family-name:var(--font-geist-sans)]">
          It looks like you&apos;ve lost your internet connection. Don&apos;t
          worry — your drafts are saved locally and will sync when you&apos;re
          back online.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#C9642A] text-white font-semibold rounded-xl hover:bg-[#b5572a] transition-colors shadow-md font-[family-name:var(--font-geist-sans)]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
