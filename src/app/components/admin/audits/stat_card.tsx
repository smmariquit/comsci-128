"use client";

import { C } from "@/lib/palette";

// ── Types ─────────────────────────────────────────────────────────────────────

export type AuditStatType =
  | "total"
  | "login"
  | "approval"
  | "assignment"
  | "billing";

interface Props {
  type: AuditStatType;
  value: number;
  delta?: number;
  deltaSub?: string;
}

// ── Config (keeps design consistent) ──────────────────────────────────────────

const STAT_CONFIG: Record<
  AuditStatType,
  { label: string; color: string; }
> = {
  total: {
    label: "Total Logs",
    color: C.navy,

  },
  login: {
    label: "Logins",
    color: C.teal,

  },
  approval: {
    label: "Approvals",
    color: C.teal,
  
  },
  assignment: {
    label: "Assignments",
    color: C.navy,

  },
  billing: {
    label: "Billing Updates",
    color: C.orange,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AuditStatCard({
  type,
  value,
  delta,
  deltaSub,
}: Props) {
  const config = STAT_CONFIG[type];

  const isPositive = delta === undefined || delta >= 0;
  const deltaColor = isPositive ? C.amber : C.orange;
  const deltaArrow = isPositive ? "↑" : "↓";

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        position: "relative",
        background: "#fff",
        borderRadius: 12,
        outline: `1px solid ${C.cream}`,
        outlineOffset: -1,
        height: 100,
      }}
    >
      {/* Label + Icon */}
      <div
        style={{
          position: "absolute",
          left: 19,
          top: 14,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
       
        <span
          style={{
            color: C.teal,
            fontSize: 10.5,
            fontFamily: "'DM Mono', monospace",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: 0.9,
          }}
        >
          {config.label}
        </span>
      </div>

      {/* Value */}
      <div
        style={{
          position: "absolute",
          left: 19,
          top: 38,
          color: config.color,
          fontSize: 26,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          lineHeight: "26px",
        }}
      >
        {value}
      </div>

      {/* Delta */}
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