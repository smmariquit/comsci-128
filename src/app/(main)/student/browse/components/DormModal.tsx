"use client";

import Image from "next/image";
import Link from "next/link";

interface DormModalProps {
  dorm: {
    id: number;
    name: string;
    address: string;
    housing_type: string; // Ensure this matches
    price: number | string;
    appli_start: string;
    appli_end: string;
  } | null;
  onClose: () => void;
}

export default function DormModal({ dorm, onClose }: DormModalProps) {
  if (!dorm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Main Card Container */}
      <div className="relative w-full max-w-[500px] overflow-hidden rounded-[20px] bg-white shadow-2xl">
        
        {/* TOP SECTION: Image and Overlay */}
        <div className="relative h-[240px] w-full">
          <Image
            src="/assets/placeholders/housing-414x264.svg" 
            alt={dorm.name}
            fill
            className="object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C2632]/80 via-transparent to-transparent" />
          
          {/* Housing Name Overlay */}
          <div className="absolute bottom-6 left-6">
            <h2 className="text-[28px] font-semibold text-white font-[family-name:var(--font-geist-sans)]">
              {dorm.name}
            </h2>
          </div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* BOTTOM SECTION: Details */}
        <div className="p-8 font-[family-name:var(--font-geist-mono)] text-[14px] space-y-3 text-[#1C2632]">
          <div className="flex gap-2">
            <span className="font-bold">Address:</span>
            <span>{dorm.address}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Housing Type:</span>
            <span>{dorm.housing_type}</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Price:</span>
            <span>{dorm.price}/month</span>
          </div>
          <div className="flex gap-2">
            <span className="font-bold">Application period:</span>
            <span>{dorm.appli_start} - {dorm.appli_end}</span>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-6">
            <button 
              className="rounded-full bg-[#C9642A] px-10 py-2.5 font-bold text-white transition-transform hover:scale-105 active:scale-95 font-[family-name:var(--font-geist-sans)]"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop Click-to-Close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}