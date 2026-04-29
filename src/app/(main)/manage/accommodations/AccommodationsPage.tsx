

"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import type { Database } from "@/app/types/database.types";

type SortOption = "name-asc" | "name-desc" | "slots-asc" | "slots-desc" | "occupants-asc" | "occupants-desc";

type Housing = Database["public"]["Tables"]["housing"]["Row"] & {
  room: Database["public"]["Tables"]["room"]["Row"][];
};


function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col flex-1 items-center">
      <span className="text-medium text-[var(--teal)]">{label}</span>
      <span className="text-lg text-[var(--dark-orange)] font-semibold">{value}</span>
    </div>
  );
}

function AccommodationCard({
  id,
  name,
  image,
  details,
}: {
  id: number;
  name: string;
  image: string | null;
  details: { label: string; value: string | number }[];
}) {
  return (
    <Link href={`/manage/accommodations/${id}`}>
      <div className="flex items-center gap-6 rounded-xl p-3 bg-[#f5ede1] text-[var(--dark-orange)] shadow-xl border-l-8 border-[var(--teal)] hover:shadow-md transition">
        <div className="w-80 h-40 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={image || "/assets/placeholders/housing-card.svg"}
            alt="Accommodation"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col w-full gap-10">
          <div className="font-semibold text-2xl text-[var(--dark-blue)]">{name}</div>
          <div className="flex w-full">
            {details.map((detail, index) => (
              <DetailItem key={index} label={detail.label} value={detail.value} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function FilterBar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  resultCount,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  resultCount: number;
}) {
  return (
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
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name…"
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            size={16}
          />
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="h-10 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition cursor-pointer"
          >
            <optgroup label="Sort by Name">
              <option value="name-asc">Name: A → Z</option>
              <option value="name-desc">Name: Z → A</option>
            </optgroup>
            <optgroup label="Sort by Free Slots">
                <option value="slots-asc">Free Slots: Low → High</option>
                <option value="slots-desc">Free Slots: High → Low</option>
            </optgroup>
            <optgroup label="Sort by Total Occupants">
                <option value="occupants-asc">Total Occupants: Low → High</option>
                <option value="occupants-desc">Total Occupants: High → Low</option>
            </optgroup>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▾</span>
        </div>
      </div>
      <p className="text-xs text-gray-400">
        {resultCount === 0
          ? "No accommodations match your search."
          : `Showing ${resultCount} accommodation${resultCount !== 1 ? "s" : ""}`}
      </p>
    </div>
  );
}

export default function AccommodationsPage({ housings }: { housings: Housing[] }) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");

  const filtered = useMemo(() => {
    let result = [...housings];
    const q = search.trim().toLowerCase();
    if (q) result = result.filter((h) => h.housing_name.toLowerCase().includes(q));
    result.sort((a, b) => {
        const aSlots = a.room.filter((r) => r.occupancy_status === "Empty").length;
        const bSlots = b.room.filter((r) => r.occupancy_status === "Empty").length;
        const aOccupants = a.room.reduce((sum, r) => sum + (r.maximum_occupants ?? 0), 0);
        const bOccupants = b.room.reduce((sum, r) => sum + (r.maximum_occupants ?? 0), 0);
        switch (sort) {
        case "name-asc":        return a.housing_name.localeCompare(b.housing_name);
        case "name-desc":       return b.housing_name.localeCompare(a.housing_name);
        case "slots-asc":       return aSlots - bSlots;
        case "slots-desc":      return bSlots - aSlots;
        case "occupants-asc":   return aOccupants - bOccupants;
        case "occupants-desc":  return bOccupants - aOccupants;
        }
     });
        return result;
    }, [housings, search, sort]);

  return (
    <main className="min-h-screen flex flex-col p-6 gap-6 bg-[var(--cream)]">
      <section className="flex flex-col gap-4 px-5">
        <h1 className="text-3xl text-[var(--dark-orange)] font-semibold">Accommodations</h1>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          resultCount={filtered.length}
        />
      </section>
      <section className="px-5">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No accommodations found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--cream)] p-6 rounded-xl">
            {filtered.map((housing) => {
              const totalOccupants = housing.room.reduce(
                (sum, r) => sum + (r.maximum_occupants ?? 0), 0
              );
              const freeSlots = housing.room.filter(
                (r) => r.occupancy_status === "Empty"
              ).length;
              return (
                <AccommodationCard
                  key={housing.housing_id}
                  id={housing.housing_id}
                  name={housing.housing_name}
                  image={housing.housing_image}
                  details={[
                    { label: "Total Occupants", value: totalOccupants },
                    { label: "Free Slots", value: freeSlots },
                  ]}
                />
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}