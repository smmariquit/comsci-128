"use client";

import { useState } from "react";
import { C } from "@/lib/palette";

interface Props {
  totalRooms:    number;
  occupied:      number;
  empty:         number;
  underMaint:    number;
}

function Card({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        minWidth: 0,
        position: "relative",
        background: "#fff",
        borderRadius: 12,
        outline: `1px solid ${C.cream}`,
        outlineOffset: -1,
        height: 100,
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 24px rgba(28,38,50,0.08)" : "none",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, outline-color 0.18s ease",
        outlineColor: hovered ? C.amber : C.cream,
      }}
    >
      <div style={{ position: "absolute", left: 19, top: 17, color: C.teal, fontSize: 10.5, fontFamily: "'DM Mono', monospace", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.9 }}>
        {label}
      </div>
      <div style={{ position: "absolute", left: 19, top: 38, color: C.navy, fontSize: 26, fontFamily: "'DM Sans', sans-serif", fontWeight: 600, lineHeight: "26px" }}>
        {value}
      </div>
      {sub && (
        <div style={{ position: "absolute", left: 19, top: 72, color: C.teal, fontSize: 11, fontFamily: "'DM Sans', sans-serif" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export default function RoomStatCards({ totalRooms, occupied, empty, underMaint }: Props) {
  const occupancyRate = totalRooms === 0 ? 0 : Math.round((occupied / totalRooms) * 100);
  return (
    <div style={{ display: "flex", gap: 16 }}>
      <Card label="Total Rooms"       value={totalRooms}   sub="across all properties"     />
      <Card label="Occupied"          value={occupied}     sub={`${occupancyRate}% occupancy rate`} />
      <Card label="Available"         value={empty}        sub="ready for assignment"       />
      <Card label="Under Maintenance" value={underMaint}   sub="temporarily unavailable"   />
    </div>
  );
}