"use client";

import { useState } from "react";
import { C } from "@/lib/palette";

export interface HousingStatusData {
  label: string;
  count: number;
  color: string;
}

interface Props {
  data: HousingStatusData[];
}

export default function StudentHousingStatus({ data }: Props) {
  const [hoveredCard, setHoveredCard] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const total = data.reduce((s, d) => s + d.count, 0);

  if (data.length === 0 || total === 0) {
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
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Student Housing Status</div>
        <div style={{ fontSize: 11, color: C.teal, marginTop: 2, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
          0 total students
        </div>
        <div style={{ textAlign: "center", padding: "24px 12px", color: C.teal }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>No housing assignments yet</div>
          <div style={{ fontSize: 11 }}>This widget will populate once students are assigned to properties.</div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHoveredCard(true)}
      onMouseLeave={() => {
        setHoveredCard(false);
        setHoveredRow(null);
      }}
      style={{
        background: "#fff",
        borderRadius: 12,
        outline: `1px solid ${C.cream}`,
        outlineOffset: -1,
        fontFamily: "'DM Sans', sans-serif",
        padding: "18px 24px 24px",
        transform: hoveredCard ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hoveredCard ? "0 12px 24px rgba(28,38,50,0.08)" : "none",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, outline-color 0.18s ease",
        outlineColor: hoveredCard ? C.amber : C.cream,
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Student Housing Status</div>
      <div style={{ fontSize: 11, color: C.teal, marginTop: 2, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
        {total} total students
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {data.map((item) => {
          const pct = total === 0 ? 0 : Math.round((item.count / total) * 100);
          return (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredRow(item.label)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                padding: "8px 10px 10px",
                borderRadius: 10,
                background: hoveredRow === item.label ? "rgba(28,38,50,0.03)" : "transparent",
                transition: "background 0.15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 500, color: C.navy }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace" }}>
                  {item.count}{" "}
                  <span style={{ color: C.amber }}>({pct}%)</span>
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 6,
                  background: C.cream,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: item.color,
                    borderRadius: 6,
                    transition: "width 0.5s ease, filter 0.15s ease",
                    filter: hoveredRow === item.label ? "brightness(1.05)" : "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}