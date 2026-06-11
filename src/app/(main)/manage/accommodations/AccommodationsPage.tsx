// src/app/(main)/manage/accommodations/AccommodationsPage.tsx

"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Database } from "@/app/types/database.types";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "slots-asc"
  | "slots-desc"
  | "occupants-asc"
  | "occupants-desc";

type Housing = Database["public"]["Tables"]["housing"]["Row"] & {
  room: Database["public"]["Tables"]["room"]["Row"][];
};

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col flex-1 items-center">
      <span className="text-medium text-[var(--teal)]">{label}</span>
      <span className="text-lg text-[var(--dark-orange)] font-semibold">
        {value}
      </span>
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
      <div className="flex min-w-0 flex-col gap-4 rounded-xl border-l-8 border-[var(--teal)] bg-[#f5ede1] p-3 text-[var(--dark-orange)] shadow-xl transition hover:shadow-md sm:flex-row sm:items-center sm:gap-6">
        <div className="h-44 w-full shrink-0 overflow-hidden rounded-lg bg-gray-300 sm:h-40 sm:w-80">
          <Image
            src={image || "/assets/placeholders/housing-card.svg"}
            alt="Accommodation"
            width={320}
            height={176}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex min-w-0 w-full flex-col gap-4 sm:gap-8">
          <div className="truncate text-xl font-semibold text-[var(--dark-blue)] sm:text-2xl">
            {name}
          </div>
          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
            {details.map((detail) => (
              <DetailItem
                key={detail.label}
                label={detail.label}
                value={detail.value}
              />
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
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
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
              <option value="occupants-desc">
                Total Occupants: High → Low
              </option>
            </optgroup>
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">
            ▾
          </span>
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

export default function AccommodationsPage({
  housings,
}: {
  housings: Housing[];
}) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name-asc");

  const filtered = useMemo(() => {
    let result = [...housings];
    const q = search.trim().toLowerCase();
    if (q)
      result = result.filter((h) => h.housing_name.toLowerCase().includes(q));

    result.sort((a, b) => {
      const nameA = a.housing_name.trim().toLowerCase();
      const nameB = b.housing_name.trim().toLowerCase();
      const aSlots = a.room.filter(
        (r) => r.occupancy_status === "Empty",
      ).length;
      const bSlots = b.room.filter(
        (r) => r.occupancy_status === "Empty",
      ).length;
      const aOccupants = a.room.reduce(
        (sum, r) => sum + (r.occupants_count ?? 0),
        0,
      );
      const bOccupants = b.room.reduce(
        (sum, r) => sum + (r.occupants_count ?? 0),
        0,
      );

      switch (sort) {
        case "name-asc":
          return nameA.localeCompare(nameB);
        case "name-desc":
          return nameB.localeCompare(nameA);
        case "slots-asc":
          return aSlots - bSlots;
        case "slots-desc":
          return bSlots - aSlots;
        case "occupants-asc":
          return aOccupants - bOccupants;
        case "occupants-desc":
          return bOccupants - aOccupants;
        default:
          return 0;
      }
    });
    return result;
  }, [housings, search, sort]);

  return (
    <main className="min-h-screen bg-[var(--cream)] p-4 sm:p-6">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-[var(--dark-orange)] sm:text-3xl">
          Accommodations
        </h1>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          sort={sort}
          onSortChange={setSort}
          resultCount={filtered.length}
        />
      </section>
      <section className="mt-6">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No accommodations found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 rounded-xl bg-[var(--cream)]">
            {filtered.map((housing) => {
              const totalOccupants = housing.room.reduce(
                (sum, r) => sum + (r.occupants_count ?? 0),
                0,
              );
              const freeSlots = housing.room.reduce(
                (sum, r) =>
                  sum + ((r.maximum_occupants ?? 0) - (r.occupants_count ?? 0)),
                0,
              );

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
