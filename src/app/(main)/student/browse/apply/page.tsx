"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const dormId = searchParams.get("id"); // Captures the ID from the URL

  return (
    <div className="min-h-screen bg-[#EDE9DE] p-10">
      <h1 className="text-2xl font-bold text-[#1C2632]">
        Application for Dorm #{dormId}
      </h1>
      
      <form className="mt-8 max-w-lg space-y-4">
        {/* Form Fields go here */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input type="text" className="w-full border p-2 rounded" />
        </div>
        
        <button 
          type="submit" 
          className="bg-[#C9642A] text-white px-6 py-2 rounded-full"
        >
          Submit Application
        </button>
      </form>
    </div>
  );
}