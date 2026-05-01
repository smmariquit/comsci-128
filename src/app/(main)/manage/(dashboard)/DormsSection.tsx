

"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Database } from "@/app/types/database.types";

type Housing = Database["public"]["Tables"]["housing"]["Row"];
type SortOption = "name-asc" | "name-desc" | "address-asc" | "address-desc";

function DormCard({ id, name, image, location }: { id: number; name: string; image: string | null; location: string; }) {
  return (
    <Link href={`/manage/accommodations/${id}`}>
      <div className="relative h-84 rounded-xl overflow-hidden shadow cursor-pointer group border border-gray-800">
        <img
          src={image || "/assets/placeholders/housing-card.svg"}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute bottom-0 w-full bg-[var(--dark-blue)]/90 text-[var(--light-yellow)] p-2 text-center">
          <p className="font-bold leading-tight">{name}</p>
          <p className="text-xs opacity-90">{location}</p>
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
    if (q) result = result.filter((h) => h.housing_name.toLowerCase().includes(q));

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
    <section className="flex flex-col gap-4 p-6 bg-[var(--teal)]/70">
      {/* <h2 className="text-xl text-[var(--dark-blue)] font-semibold">Dorms Managed</h2> */}

      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition"
            />
          </div>
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-10 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition cursor-pointer"
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
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▾</span>
          </div>
        </div>
        <p className="text-xs text-gray-600">
          {filtered.length === 0
            ? "No dorms match your search."
            : `Showing ${filtered.length} dorm${filtered.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 p-2">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No dorms found.</p>
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
    </section>
  );
}