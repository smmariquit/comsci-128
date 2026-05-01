"use client";

import { useState } from "react";
import { C } from "@/lib/palette";

export interface UserTypeCount {
  label: string;
  count: number;
}

interface Props {
  data: UserTypeCount[];
  total: number;
}

export default function ActiveUsers({ data, total }: Props) {
  const [hoveredCard, setHoveredCard] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

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
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Active Users</div>
        <div style={{ fontSize: 11, color: C.teal, marginTop: 2, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
          0 total non-deleted accounts
        </div>
        <div style={{ textAlign: "center", padding: "24px 12px", color: C.teal }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>No active users yet</div>
          <div style={{ fontSize: 11 }}>User counts will appear here once accounts exist in the system.</div>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHoveredCard(true)}
      onMouseLeave={() => {
        setHoveredCard(false);
        setHoveredItem(null);
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
      <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Active Users</div>
      <div style={{ fontSize: 11, color: C.teal, marginTop: 2, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
        {total} total non-deleted accounts
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((item) => (
          <div
            key={item.label}
            onMouseEnter={() => setHoveredItem(item.label)}
            onMouseLeave={() => setHoveredItem(null)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              background: C.cream,
              borderRadius: 8,
              transform: hoveredItem === item.label ? "translateX(2px)" : "translateX(0)",
              boxShadow: hoveredItem === item.label ? "0 6px 14px rgba(28,38,50,0.06)" : "none",
              transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
              backgroundColor: hoveredItem === item.label ? "rgba(227,175,100,0.14)" : C.cream,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 500, color: C.navy }}>{item.label}</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.navy,
                background: C.amber,
                padding: "2px 10px",
                borderRadius: 20,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}