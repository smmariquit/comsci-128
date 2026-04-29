"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Users, Bed, DoorOpen } from "lucide-react";

function UnitCard({
  id,
  name,
  occupants,
  freeSlots,
  bedType,
  housingId
}: {
  id: number;
  name: string;
  occupants: number;
  freeSlots: number;
  bedType: string;
  housingId: number;
}) {
  return (
    <Link href={`/manage/accommodations/${housingId}/${id}`} className="block">
      <div className="rounded-xl p-5 bg-[var(--dark-blue)] hover:brightness-110 transition cursor-pointer border border-[var(--dark-orange)]/20">
        <h3 className="text-3xl text-[var(--dark-orange)] font-bold mb-4">{name}</h3>
        
        <div className="grid grid-cols-2 gap-y-3 gap-x-2">
          <div className="flex items-center gap-2 text-[var(--cream)] text-sm">
            <Users size={16} className="text-[var(--dark-orange)] shrink-0" />
            <span className="opacity-80">Occupants</span>
          </div>
          <div className="text-[var(--cream)] font-medium text-base text-right">
            {occupants}
          </div>

          <div className="flex items-center gap-2 text-[var(--cream)] text-sm">
            <Bed size={16} className="text-[var(--dark-orange)] shrink-0" />
            <span className="opacity-80">Free Slots</span>
          </div>
          <div className="text-[var(--cream)] font-medium text-base text-right">
            {freeSlots}
          </div>

          <div className="flex items-center gap-2 text-[var(--cream)] text-sm">
            <DoorOpen size={16} className="text-[var(--dark-orange)] shrink-0" />
            <span className="opacity-80">Bed Type</span>
          </div>
          <div className="text-[var(--cream)] font-medium text-base text-right capitalize">
            {bedType}
          </div>
        </div>
      </div>
    </Link>
  );
}

type Unit = {
  id: number;
  name: string;
  occupants: number;
  freeSlots: number;
  bedType: string;
  housingId: number;
};

type Tenant = any

export default function AccommodationClient({
  units: initialUnits,
  tenants: initialTenants,
  housingName,
  housingImage,
  housingId
}: {
  units: Unit[];
  tenants: Tenant[];
  housingName: string;
  housingImage: string | null;
  housingId: number;
}) {
  const [unitSearch, setUnitSearch] = useState("");
  const [unitSort, setUnitSort] = useState<"num-asc" | "num-desc" | "occupants-desc" | "occupants-asc" | "free-asc" | "free-desc">("num-asc");
  const [tenantSearch, setTenantSearch] = useState("");
  const [tenantSort, setTenantSort] = useState<"name-asc" | "name-desc" | "unit-asc" | "unit-desc" | "start-asc" | "start-desc" | "end-asc" | "end-desc">("name-asc");

  const filteredUnits = useMemo(() => {
    let result = [...initialUnits];
    const q = unitSearch.trim().toLowerCase();
    if (q) {
      result = result.filter((unit) =>
        unit.name.toLowerCase().includes(q) ||
        unit.bedType.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      switch (unitSort) {
        case "num-asc":
          return a.name.localeCompare(b.name);
        case "num-desc":
          return b.name.localeCompare(a.name);
        case "occupants-desc":
          return b.occupants - a.occupants;
        case "occupants-asc":
          return a.occupants - b.occupants;
        case "free-desc":
          return b.freeSlots - a.freeSlots;
        case "free-asc":
          return a.freeSlots - b.freeSlots;
        default:
          return 0;
      }
    });
    return result;
  }, [initialUnits, unitSearch, unitSort]);

  const filteredTenants = useMemo(() => {
    let result = [...initialTenants];
    const q = tenantSearch.trim().toLowerCase();
    if (q) {
      result = result.filter((tenant) => {
        const user = tenant.student?.user;
        const fullName = user
          ? `${user.first_name} ${user.middle_name || ""} ${user.last_name}`.toLowerCase()
          : "";
        const unitNumber = tenant.room?.room_id ? `unit #${tenant.room.room_id}` : "";
        return fullName.includes(q) || unitNumber.includes(q);
      });
    }

    result.sort((a, b) => {
      const getName = (t: Tenant) => {
        const user = t.student?.user;
        return user
          ? `${user.first_name} ${user.middle_name || ""} ${user.last_name}`.toLowerCase()
          : "";
      };
      const getUnitNum = (t: Tenant) => t.room?.room_id ?? 0;

      switch (tenantSort) {
        case "name-asc":
          return getName(a).localeCompare(getName(b));
        case "name-desc":
          return getName(b).localeCompare(getName(a));
        case "unit-asc":
          return getUnitNum(a) - getUnitNum(b);
        case "unit-desc":
          return getUnitNum(b) - getUnitNum(a);
        case "start-asc":
          return new Date(a.movein_date).getTime() - new Date(b.movein_date).getTime();
        case "start-desc":
          return new Date(b.movein_date).getTime() - new Date(a.movein_date).getTime();
        case "end-asc":
          return new Date(a.moveout_date).getTime() - new Date(b.moveout_date).getTime();
        case "end-desc":
          return new Date(b.moveout_date).getTime() - new Date(a.moveout_date).getTime();
        default:
          return 0;
      }
    });
    return result;
  }, [initialTenants, tenantSearch, tenantSort]);

  return (
    <>
      <div className="relative h-[40vh] min-h-[250px] rounded-xl overflow-hidden">
        <img
          src={housingImage || "/assets/placeholders/housing-card.svg"}
          className="w-full h-full object-cover"
          alt={housingName}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 w-full flex justify-between items-center p-4 text-[var(--dark-orange)]">
          <h2 className="text-2xl font-semibold">{housingName}</h2>
          <Link
            href={`/manage/accommodations/${housingId}/assignment`}
            className="bg-[var(--dark-orange)] text-[var(--dark-blue)] px-4 py-2 rounded text-sm font-medium hover:brightness-90 hover:shadow-md transition"
          >
            Assign Rooms
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6 py-20 px-10 rounded-lg">
        <h1 className="text-2xl font-semibold text-[var(--dark-blue)]">Units</h1>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input
                type="text"
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                placeholder="Search units by name or bed type…"
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-400 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <select
                value={unitSort}
                onChange={(e) => setUnitSort(e.target.value as any)}
                className="h-10 pl-9 pr-8 rounded-lg border border-gray-400 bg-white text-sm text-gray-700 appearance-none focus:outline-none cursor-pointer"
              >
                <optgroup label="Sort by Unit Number">
                  <option value="num-desc">High to Low</option>
                  <option value="num-asc">Low to High</option>
                </optgroup>
                <optgroup label="Sort by Occupants">
                  <option value="occupants-desc">High to Low</option>
                  <option value="occupants-asc">Low to High</option>
                </optgroup>
                <optgroup label="Sort by Free Slots">
                  <option value="free-desc">High to Low</option>
                  <option value="free-asc">Low to High</option>
                </optgroup>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▾</span>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            {filteredUnits.length === 0
              ? "No units match your search."
              : `Showing ${filteredUnits.length} unit${filteredUnits.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredUnits.map((unit) => (
            <UnitCard key={unit.id} {...unit} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6 px-12 pb-10">
        <h2 className="text-2xl text-[var(--dark-blue)] font-semibold">All Tenants</h2>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <input
                type="text"
                value={tenantSearch}
                onChange={(e) => setTenantSearch(e.target.value)}
                placeholder="Search tenants by name or unit…"
                className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-400 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              <select
                value={tenantSort}
                onChange={(e) => setTenantSort(e.target.value as any)}
                className="h-10 pl-9 pr-8 rounded-lg border border-gray-400 bg-white text-sm text-gray-700 appearance-none focus:outline-none transition cursor-pointer"
              >
                <optgroup label="Sort by Name">
                  <option value="name-asc">A → Z</option>
                  <option value="name-desc">Z → A</option>
                </optgroup>
                <optgroup label="Sort by Unit">
                  <option value="unit-asc">Low to High</option>
                  <option value="unit-desc">High to Low</option>
                </optgroup>
                <optgroup label="Sort by Start of Stay">
                  <option value="start-asc">Earliest First</option>
                  <option value="start-desc">Latest First</option>
                </optgroup>
                <optgroup label="Sort by End of Stay">
                  <option value="end-asc">Earliest First</option>
                  <option value="end-desc">Latest First</option>
                </optgroup>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▾</span>
            </div>
          </div>
          <p className="text-xs text-gray-600">
            {filteredTenants.length === 0
              ? "No tenants match your search."
              : `Showing ${filteredTenants.length} tenant${filteredTenants.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="rounded-lg overflow-hidden bg-yellow-100">
          <table className="w-full text-sm">
            <thead className="bg-[var(--dark-blue)] text-[var(--dark-orange)]">
              <tr>
                <th className="text-left p-3">Name</th>
                <th className="text-left p-3">Unit</th>
                <th className="text-left p-3">Start of Stay</th>
                <th className="text-left p-3">End of Stay</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-3 text-gray-400">No tenants match your search.</td>
                </tr>
              ) : (
                filteredTenants.map((tenant: any) => {
                  const user = tenant.student?.user;
                  const fullName = user
                    ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
                    : "Unknown";
                  return (
                    <tr key={tenant.account_number} className="border-t text-[var(--dark-blue)] hover:bg-black/5">
                      <td className="p-3">{fullName}</td>
                      <td className="p-3">Unit #{tenant.room?.room_id}</td>
                      <td className="p-3">{tenant.movein_date}</td>
                      <td className="p-3">{tenant.moveout_date}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}