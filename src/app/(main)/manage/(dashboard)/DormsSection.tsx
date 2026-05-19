"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";
import type { Database } from "@/app/types/database.types";

type Housing = Database["public"]["Tables"]["housing"]["Row"];
type SortOption = "name-asc" | "name-desc" | "address-asc" | "address-desc";

function DormCard({
  id,
  name,
  image,
  location,
}: {
  id: number;
  name: string;
  image: string | null;
  location: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/manage/accommodations/${id}`} className="rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[var(--teal)]">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative h-80 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? "0 20px 40px rgba(28, 38, 50, 0.18)"
            : "0 8px 16px rgba(28, 38, 50, 0.12)",
          transform: isHovered ? "translateY(-6px)" : "translateY(0)",
        }}
      >
        {/* Image with overlay */}
        <img
          src={image || "/assets/placeholders/housing-card.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{
            transform: isHovered ? "scale(1.08)" : "scale(1)",
          }}
        />

        {/* Gradient Overlay - Bottom to Top */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(28, 38, 50, 0.94) 0%, rgba(28, 38, 50, 0.7) 35%, transparent 80%)",
          }}
        />

        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {/* Top Badge (Optional Accent) */}
          <div className="flex justify-end">
            <div
              className="px-3 py-1 rounded-full backdrop-blur-sm transition-opacity duration-300"
              style={{
                background: "rgba(139, 62, 21, 0.8)",
                opacity: isHovered ? 1 : 0.7,
              }}
            >
              <span className="text-xs font-semibold text-white">
                Managed
              </span>
            </div>
          </div>

          {/* Bottom Content */}
          <div className="flex flex-col gap-3">
            {/* Title */}
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-[var(--light-yellow)] leading-tight line-clamp-2">
                {name}
              </h3>
              <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                {location}
              </p>
            </div>

            {/* CTA Arrow */}
            <div
              className="flex items-center gap-2 text-[var(--light-yellow)] transition-all duration-300"
              style={{
                opacity: isHovered ? 1 : 0.5,
                transform: isHovered ? "translateX(4px)" : "translateX(0)",
              }}
            >
              <span className="text-xs font-semibold uppercase tracking-wide">
                Manage
              </span>
              <ArrowRight size={16} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DormsSection({ dorms }: { dorms: Housing[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");

  const filtered = useMemo(() => {
    let result = [...dorms];
    const q = search.trim().toLowerCase();
    if (q)
      result = result.filter((h) => h.housing_name.toLowerCase().includes(q));

    result.sort((a, b) => {
      const nameA = a.housing_name.trim().toLowerCase();
      const nameB = b.housing_name.trim().toLowerCase();
      const addressA = a.housing_address.trim().toLowerCase();
      const addressB = b.housing_address.trim().toLowerCase();

      switch (sort) {
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "address-asc":
          return addressA.localeCompare(addressB);
        case "address-desc":
          return addressB.localeCompare(addressA);
        default:
          return 0;
      }
    });
    return result;
  }, [dorms, search, sort]);

  return (
    <div className="rounded-[28px] border border-[#d8d0c2] bg-white/90 p-6 shadow-sm flex flex-col gap-6">
      {/* <h2 className="text-xl text-[var(--dark-blue)] font-semibold">Dorms Managed</h2> */}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[var(--teal)] transition"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-10 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[var(--teal)] transition cursor-pointer"
            >
              <optgroup label="Sort by Name">
                <option value="name-asc">Name: A → Z</option>
                <option value="name-desc">Name: Z → A</option>
              </optgroup>
              <optgroup label="Sort by Address">
                <option value="address-asc">Address: A → Z</option>
                <option value="address-desc">Address: Z → A</option>
              </optgroup>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
              ▾
            </span>
          </div>
        </div>
        <p className="text-xs text-[#567375] font-semibold">
          {filtered.length === 0
            ? "No dorms match your search."
            : `Showing ${filtered.length} dorm${filtered.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-6">No dorms found.</p>
        ) : (
          filtered.map((dorm) => (
            <DormCard
              key={dorm.housing_id}
              id={dorm.housing_id}
              name={dorm.housing_name}
              image={dorm.housing_image}
              location={dorm.housing_address}
            />
          ))
        )}
      </div>
    </div>
  );
}
