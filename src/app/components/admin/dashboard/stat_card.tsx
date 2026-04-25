"use client";

import { C } from "@/lib/palette";
import { useState } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaSub?: string;
}

export default function StatCard({ label, value, delta, deltaSub }: StatCardProps) {
  const [hovered, setHovered] = useState(false);
  const isPositive = delta === undefined || delta >= 0;
  // Up = amber, down = orange (both from palette)
  const deltaColor = isPositive ? C.amber : C.orange;
  const deltaArrow = isPositive ? "↑" : "↓";

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
      {/* Label */}
      <div
        style={{
          position: "absolute",
          left: 19,
          top: 17,
          color: C.teal,
          fontSize: 10.5,
          fontFamily: "'DM Mono', monospace",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: 0.9,
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        style={{
          position: "absolute",
          left: 19,
          top: 38,
          color: C.navy,
          fontSize: 26,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          lineHeight: "26px",
        }}
      >
        {value}
      </div>

      {/* Delta row */}
      {(delta !== undefined || deltaSub) && (
        <div
          style={{
            position: "absolute",
            left: 19,
            top: 70,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {delta !== undefined && (
            <span
              style={{
                color: deltaColor,
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
              }}
            >
              {deltaArrow} {Math.abs(delta)}
            </span>
          )}
          {deltaSub && (
            <span
              style={{
                color: C.teal,
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
              }}
            >
              {deltaSub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}