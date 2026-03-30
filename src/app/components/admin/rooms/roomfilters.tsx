"use client";

import { C } from "@/lib/palette";
import type { OccupancyStatus,  RoomType } from "./roomtable.tsx";

export type OccupancyFilter = "All" | OccupancyStatus;
export type TypeFilter      = "All" | RoomType;

interface Props {
  search:         string;
  occupancy:      OccupancyFilter;
  roomType:       TypeFilter;
  housing:        string;
  housingOptions: string[];
  onSearch:       (v: string)           => void;
  onOccupancy:    (v: OccupancyFilter)  => void;
  onRoomType:     (v: TypeFilter)       => void;
  onHousing:      (v: string)           => void;
}

const inputBase: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12,
  color: C.navy,
  background: "#fff",
  border: `1px solid ${C.cream}`,
  borderRadius: 8,
  padding: "8px 12px",
  outline: "none",
  height: 36,
  boxSizing: "border-box" as const,
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  cursor: "pointer",
  appearance: "none" as const,
  paddingRight: 28,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23567375' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
};

export default function RoomFilters({ search, occupancy, roomType, housing, housingOptions, onSearch, onOccupancy, onRoomType, onHousing }: Props) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      {/* Search */}
      <div style={{ position: "relative", flex: "1 1 180px", minWidth: 160 }}>
        <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="Search room, tenant..." value={search} onChange={(e) => onSearch(e.target.value)} style={{ ...inputBase, width: "100%", paddingLeft: 32 }} />
      </div>

      {/* Property / Housing */}
      <select
        title="Filter by property"
        aria-label="Filter by property"
        value={housing}
        onChange={(e) => onHousing(e.target.value)}
        style={{ ...selectBase, minWidth: 170 }}
      >
        <option value="All">All Properties</option>
        {housingOptions.map((h) => <option key={h} value={h}>{h}</option>)}
      </select>

      {/* Room type */}
      <select
        title="Filter by room type"
        aria-label="Filter by room type"
        value={roomType}
        onChange={(e) => onRoomType(e.target.value as TypeFilter)}
        style={{ ...selectBase, minWidth: 130 }}
      >
        {(["All", "Single", "Double", "Suite", "Bedspace"] as TypeFilter[]).map((t) => (
          <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>
        ))}
      </select>

      {/* Occupancy */}
      <select
        title="Filter by occupancy status"
        aria-label="Filter by occupancy status"
        value={occupancy}
        onChange={(e) => onOccupancy(e.target.value as OccupancyFilter)}
        style={{ ...selectBase, minWidth: 160 }}
      >
        {(["All", "Empty", "Occupied", "Reserved", "Under Maintenance"] as OccupancyFilter[]).map((s) => (
          <option key={s} value={s}>{s === "All" ? "All Occupancy" : s}</option>
        ))}
      </select>
    
    </div>
  );
}