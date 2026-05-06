import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline | UPLB CASA",
};

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9F7F5] p-6 text-center text-[#1C2632]">
      <div className="w-64 h-64 mb-8 bg-[#E3AF64] rounded-full flex items-center justify-center opacity-80 shadow-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-32 h-32 text-[#C9642A]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l18 18m-3.23-3.23A10.95 10.95 0 0112 21c-4.32 0-8-2.5-9.66-6.19a2.5 2.5 0 010-1.62C3.21 11.08 5.16 9.07 7.6 8.01m2.76-2.02A10.95 10.95 0 0112 5.5c4.32 0 8 2.5 9.66 6.19a2.5 2.5 0 010 1.62c-1.12 2.6-3.47 4.54-6.32 5.37M9.88 9.88a3 3 0 004.24 4.24"
          />
        </svg>
      </div>
      <h1 className="text-4xl font-bold mb-4 font-[family-name:var(--font-geist-sans)]">
        You are offline
      </h1>
      <p className="text-lg max-w-md text-[#567375] font-[family-name:var(--font-geist-mono)]">
        It looks like you've lost your internet connection. But don't worry, 
        UPLB CASA is still installed on your device! Reconnect to view active dorms.
      </p>
      <button 
        className="mt-8 px-6 py-3 bg-[#C9642A] text-white rounded-lg shadow hover:bg-[#A84B1D] transition font-bold"
        onClick={() => window.location.reload()}
      >
        Try Again
      </button>
    </div>
  );
}
