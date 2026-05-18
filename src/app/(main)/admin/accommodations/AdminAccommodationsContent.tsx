"use client";

import { useState, useMemo } from "react";
import { Map, LayoutGrid } from "lucide-react";
import HousingMap, { type HousingMarker } from "@/app/components/map/HousingMap";
import DormCard from "@/app/components/admin/dorm_card";

type DormCardData = {
  housingId: string;
  housingIdNum: number;
  name: string;
  address: string;
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  occupancyRate: number;
  minRent: number;
  managerAccountNumber: string | null;
  latitude: number | null;
  longitude: number | null;
  image: string | null;
  housingType: string;
};

export default function AdminAccommodationsContent({
  dormCards,
}: {
  dormCards: DormCardData[];
}) {
  const [showMap, setShowMap] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const markers: HousingMarker[] = useMemo(
    () =>
      dormCards
        .filter((d) => d.latitude && d.longitude)
        .map((d) => ({
          id: d.housingIdNum,
          name: d.name,
          type: d.housingType,
          price: d.minRent,
          lat: d.latitude!,
          lng: d.longitude!,
          image: d.image,
        })),
    [dormCards]
  );

  return (
    <>
      {markers.length > 0 && (
        <div className="w-full max-w-6xl mx-auto flex justify-end mb-4">
          <button
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C2632] text-white text-sm font-semibold hover:opacity-90 transition shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dark-orange)]"
          >
            {showMap ? <LayoutGrid size={16} /> : <Map size={16} />}
            {showMap ? "Hide Map" : "Show Map"}
          </button>
        </div>
      )}

      {showMap && markers.length > 0 && (
        <div className="w-full max-w-6xl mx-auto mb-6">
          <div className="w-full rounded-xl overflow-hidden shadow-lg" style={{ height: "400px" }}>
            <HousingMap
              housings={markers}
              selectedId={selectedId}
              onMarkerClick={(id) => setSelectedId(id)}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
        {dormCards.length === 0 ? (
          <div className="w-full max-w-6xl mx-auto rounded-2xl border border-[#CEC7B0] bg-white px-8 py-14 text-center text-[#1C2632] shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#EDE9DE] text-[#8AABAC]">
              0
            </div>
            <div className="text-lg font-semibold">No properties found</div>
            <div className="mt-2 text-sm text-[#8AABAC]">
              Property cards will appear here once housing records are available.
            </div>
          </div>
        ) : (
          dormCards.map((housing) => (
            <DormCard key={housing.housingId} {...housing} />
          ))
        )}
      </div>
    </>
  );
}
