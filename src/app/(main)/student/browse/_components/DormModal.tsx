"use client";

import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface DormModalProps {
  dorm: {
    id: number;
    name: string;
    address: string;
    housing_type: string;
    price: number | string;
    appli_start: string;
    appli_end: string;
    has_wifi: boolean;
    has_aircon: boolean;
    has_laundry: boolean;
    has_parking: boolean;
    has_no_curfew: boolean;
    allows_visitors: boolean;
    is_furnished: boolean;
    has_kitchen: boolean;
    has_security: boolean;
    has_utilities_included: boolean;
  } | null;
  onClose: () => void;
  onViewMap?: () => void;
}

export default function DormModal({ dorm, onClose, onViewMap }: DormModalProps) {
  if (!dorm) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Main Card Container */}
      <div className="relative w-full max-w-[500px] overflow-hidden rounded-[20px] bg-white shadow-2xl">
        {/* TOP SECTION: Image and Overlay */}
        <div className="relative h-[240px] w-full">
          <Image
            src={
              dorm.name === "Makiling Residence Hall"
                ? "/assets/placeholders/makiling.png" // assuming the image is different in prod, fallback
                : "/assets/placeholders/housing-414x264.svg"
            }
            alt={dorm.name}
            fill
            className="object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C2632]/90 via-[#1C2632]/20 to-transparent" />

          {/* Housing Name Overlay */}
          <div className="absolute bottom-6 left-6 pr-6">
            <h2 className="text-[28px] leading-tight font-semibold text-white font-[family-name:var(--font-geist-sans)] drop-shadow-md">
              {dorm.name}
            </h2>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors shadow-lg"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* BOTTOM SECTION: Details */}
        <div className="p-8 font-[family-name:var(--font-geist-mono)] text-[14px] text-[#1C2632]">
          
          <div className="space-y-3 mb-6">
            <div className="flex gap-2">
              <span className="font-bold min-w-[120px]">Address:</span>
              <span className="text-[#1C2632]/80">{dorm.address}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold min-w-[120px]">Housing Type:</span>
              <span className="text-[#1C2632]/80">{dorm.housing_type}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold min-w-[120px]">Price:</span>
              <span className="text-[#1C2632]/80 font-semibold text-[#C9642A]">₱{dorm.price}/month</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold min-w-[120px]">Applications:</span>
              <span className="text-[#1C2632]/80">
                {dorm.appli_start} — {dorm.appli_end}
              </span>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="pt-5 border-t border-gray-100">
            <span className="block font-bold mb-3">Amenities provided:</span>
            <div className="flex flex-wrap gap-2">
              {dorm.has_wifi && <span className="px-2.5 py-1 rounded-md bg-[#8AABAC]/15 text-[#567375] font-semibold text-xs">📶 WiFi</span>}
              {dorm.has_aircon && <span className="px-2.5 py-1 rounded-md bg-[#8AABAC]/15 text-[#567375] font-semibold text-xs">❄️ Aircon</span>}
              {dorm.is_furnished && <span className="px-2.5 py-1 rounded-md bg-[#8AABAC]/15 text-[#567375] font-semibold text-xs">🛏️ Furnished</span>}
              {dorm.has_kitchen && <span className="px-2.5 py-1 rounded-md bg-[#8AABAC]/15 text-[#567375] font-semibold text-xs">🍳 Kitchen</span>}
              {dorm.has_laundry && <span className="px-2.5 py-1 rounded-md bg-[#8AABAC]/15 text-[#567375] font-semibold text-xs">🧺 Laundry</span>}
              {dorm.has_parking && <span className="px-2.5 py-1 rounded-md bg-[#8AABAC]/15 text-[#567375] font-semibold text-xs">🚗 Parking</span>}
              {dorm.has_security && <span className="px-2.5 py-1 rounded-md bg-[#8AABAC]/15 text-[#567375] font-semibold text-xs">🛡️ Security</span>}
              {dorm.has_utilities_included && <span className="px-2.5 py-1 rounded-md bg-[#8AABAC]/15 text-[#567375] font-semibold text-xs">⚡ Utilities Incl.</span>}
              {dorm.has_no_curfew && <span className="px-2.5 py-1 rounded-md bg-[#C9642A]/15 text-[#C9642A] font-semibold text-xs">🦉 No Curfew</span>}
              {dorm.allows_visitors && <span className="px-2.5 py-1 rounded-md bg-[#C9642A]/15 text-[#C9642A] font-semibold text-xs">👋 Visitors Allowed</span>}
              
              {!dorm.has_wifi && !dorm.has_aircon && !dorm.is_furnished && !dorm.has_kitchen && !dorm.has_laundry && !dorm.has_parking && !dorm.has_security && !dorm.has_utilities_included && !dorm.has_no_curfew && !dorm.allows_visitors && (
                <span className="text-gray-400 text-sm italic">No amenities listed.</span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-6 gap-3">
            {onViewMap && (
              <button
                onClick={onViewMap}
                className="rounded-full bg-gray-100 px-6 py-2.5 font-bold text-[#1C2632] hover:bg-gray-200 transition-colors font-[family-name:var(--font-geist-sans)]"
              >
                View 3D Map
              </button>
            )}
            <Link
              href={`/student/browse/apply?id=${dorm.id}`} // Passing the ID via query param
              className="rounded-full bg-[#C9642A] px-10 py-2.5 font-bold text-white transition-transform hover:scale-105 active:scale-95 font-[family-name:var(--font-geist-sans)]"
            >
              Apply
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop Click-to-Close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
