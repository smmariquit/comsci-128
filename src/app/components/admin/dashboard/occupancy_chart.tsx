"use client";

import { C } from "@/lib/palette";
import { useState } from "react";

export interface OccupancyData {
  room_type: string;
  occupied: number;
  empty: number;
}

interface Props {
  data: OccupancyData[];
}

export default function OccupancyChart({ data }: Props) {
  const [hovered, setHovered] = useState(false);

  if (data.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          outline: `1px solid ${C.cream}`,
          outlineOffset: -1,
          fontFamily: "'DM Sans', sans-serif",
          padding: "18px 24px 24px",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Occupancy by Room Type</div>
        <div style={{ fontSize: 11, color: C.teal, marginTop: 2, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
          Occupied vs empty rooms
        </div>
        <div style={{ textAlign: "center", padding: "28px 12px", color: C.teal }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>No occupancy data yet</div>
          <div style={{ fontSize: 11 }}>Room type occupancy will appear once properties have room records.</div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 12,
        outline: `1px solid ${C.cream}`,
        outlineOffset: -1,
        fontFamily: "'DM Sans', sans-serif",
        padding: "18px 24px 24px",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? "0 12px 24px rgba(28,38,50,0.08)" : "none",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, outline-color 0.18s ease",
        outlineColor: hovered ? C.amber : C.cream,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Occupancy by Room Type</div>
      <div style={{ fontSize: 11, color: C.teal, marginTop: 2, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
        Occupied vs empty rooms
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {[
          { label: "Occupied", color: C.orange },
          { label: "Empty",    color: C.cream  },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, outline: `1px solid ${C.cream}` }} />
            <span style={{ fontSize: 11, color: C.teal }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.map((row) => {
          const total = row.occupied + row.empty;
          const occupiedPct = total === 0 ? 0 : (row.occupied / total) * 100;
          const emptyPct = 100 - occupiedPct;
          return (
            <div key={row.room_type}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.navy }}>{row.room_type}</span>
                <span style={{ fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace" }}>
                  {row.occupied}/{total}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  height: 8,
                  borderRadius: 6,
                  overflow: "hidden",
                  background: C.cream,
                }}
              >
                {occupiedPct > 0 && (
                  <div style={{ width: `${occupiedPct}%`, background: C.orange, transition: "width 0.5s ease" }} />
                )}
                {emptyPct > 0 && (
                  <div style={{ width: `${emptyPct}%`, background: C.cream }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}