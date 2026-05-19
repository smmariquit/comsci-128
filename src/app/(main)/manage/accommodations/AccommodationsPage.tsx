"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Map, LayoutGrid } from "lucide-react";
import HousingMap, { type HousingMarker } from "@/app/components/map/HousingMap";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/manage/accommodations/${id}`} className="block rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--teal)]">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex flex-col sm:flex-row items-stretch gap-5 rounded-2xl p-4 bg-white border border-[#d8d0c2] transition-all duration-300 cursor-pointer"
        style={{
          boxShadow: isHovered
            ? "0 12px 24px rgba(28, 38, 50, 0.08)"
            : "0 2px 4px rgba(28, 38, 50, 0.04)",
          transform: isHovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        {/* Left Side: Image container */}
        <div className="w-full sm:w-48 h-36 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
          <img
            src={image || "/assets/placeholders/housing-card.svg"}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
          />
        </div>

        {/* Right Side: Info content */}
        <div className="flex flex-col justify-between flex-1 min-w-0 py-1">
          <div>
            <h3 className="font-bold text-xl text-[var(--dark-blue)] transition-colors duration-300 truncate">
              {name}
            </h3>
          </div>

          <div className="flex gap-8 mt-4 pt-4 border-t border-[#f4f1ea]">
            {details.map((detail, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-xs uppercase tracking-wider text-[#567375] font-semibold">
                  {detail.label}
                </span>
                <span className="text-2xl font-bold text-[#8b3e15] mt-1">
                  {detail.value}
                </span>
              </div>
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
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-[#d8d0c2] bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition"
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
            className="h-10 pl-9 pr-8 rounded-lg border border-[#d8d0c2] bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--teal)] transition cursor-pointer"
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
      <p className="text-xs text-[#567375] font-semibold">
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
  const [showMap, setShowMap] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const markers: HousingMarker[] = useMemo(
    () =>
      housings
        .filter((h) => h.latitude && h.longitude)
        .map((h) => ({
          id: h.housing_id,
          name: h.housing_name,
          type: h.housing_type,
          price: h.rent_price,
          lat: h.latitude!,
          lng: h.longitude!,
          image: h.housing_image,
        })),
    [housings]
  );

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
    <div className={`accommodations-root ${showMap ? "map-visible" : "map-hidden"} bg-[var(--cream)]`}>
      {/* Left: Map (Desktop only, visible when showMap=true) */}
      {showMap && markers.length > 0 && (
        <div className="accommodations-map-panel hidden lg:flex flex-col min-w-0 border-r border-gray-200">
          <HousingMap
            housings={markers}
            selectedId={selectedId}
            onMarkerClick={(id) => setSelectedId(id)}
          />
        </div>
      )}

      {/* Right: Search + Cards */}
      <div className="accommodations-content-panel flex-1 flex flex-col min-w-0">
        {/* Header + Toolbar */}
        <section className="flex flex-col gap-4 px-4 md:px-6 py-6 border-b border-gray-200 flex-shrink-0 bg-white/40">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl text-[var(--dark-blue)] font-extrabold">
              Accommodations
            </h1>
            {markers.length > 0 && (
              <button
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-[#1C2632] text-white text-xs md:text-sm font-semibold hover:bg-[#2a3a4e] transition shadow-md"
              >
                {showMap ? <LayoutGrid size={16} /> : <Map size={16} />}
                <span className="hidden sm:inline">{showMap ? "Hide Map" : "Show Map"}</span>
              </button>
            )}
          </div>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            resultCount={filtered.length}
          />
        </section>

        {/* Mobile Map (Full width below header) */}
        {showMap && markers.length > 0 && (
          <section className="lg:hidden flex-shrink-0 border-b border-gray-200">
            <div className="w-full" style={{ height: "300px" }}>
              <HousingMap
                housings={markers}
                selectedId={selectedId}
                onMarkerClick={(id) => setSelectedId(id)}
              />
            </div>
          </section>
        )}

        {/* Scrollable Cards Area */}
        <div className="accommodations-cards-scroll manage-scrollbar flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-full p-8">
              <p className="text-gray-500 text-center">No accommodations found.</p>
            </div>
          ) : (
            <div className="p-4 md:p-6 space-y-4 max-w-5xl mx-auto w-full">
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
        </div>
      </div>

      <style>{`
        .accommodations-root {
          position: relative;
          display: flex;
          width: 100%;
        }

        .accommodations-root.map-hidden {
          flex-direction: column;
          min-height: calc(100vh - 7.75rem);
        }

        .accommodations-root.map-hidden .accommodations-content-panel {
          width: 100%;
          height: auto;
        }

        .accommodations-cards-scroll {
          scrollbar-gutter: stable;
        }

        @media (min-width: 1024px) {
          .accommodations-root.map-visible {
            flex-direction: row;
            height: calc(100vh - 7.75rem);
            min-height: 0;
            overflow: hidden;
          }

          .accommodations-root.map-visible .accommodations-map-panel {
            width: 50%;
            height: 100%;
            min-width: 0;
            flex-shrink: 0;
          }

          .accommodations-root.map-visible .accommodations-content-panel {
            width: 50%;
            height: 100%;
            min-width: 0;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  );
}
