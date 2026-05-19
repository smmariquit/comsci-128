"use client";

import { C } from "@/lib/palette";
import {
  FileCheck,
  LogIn,
  CheckCircle2,
  UserCheck,
  CreditCard,
} from "lucide-react";


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
  { label: string; color: string; icon: React.ReactNode; bgGradient: string }
> = {
  total: {
    label: "Total Logs",
    color: C.navy,
    icon: <FileCheck size={20} />,
    bgGradient: "linear-gradient(135deg, #1C2632 0%, #2a3544 100%)",
  },
  login: {
    label: "Logins",
    color: C.teal,
    icon: <LogIn size={20} />,
    bgGradient: "linear-gradient(135deg, #567375 0%, #6f8888 100%)",
  },
  approval: {
    label: "Approvals",
    color: "#4f46e5",
    icon: <CheckCircle2 size={20} />,
    bgGradient: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
  },
  assignment: {
    label: "Assignments",
    color: "#7c3aed",
    icon: <UserCheck size={20} />,
    bgGradient: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)",
  },
  billing: {
    label: "Billing Updates",
    color: C.orange,
    icon: <CreditCard size={20} />,
    bgGradient: "linear-gradient(135deg, #8b3e15 0%, #a8512d 100%)",
  },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AuditStatCard({ type, value, delta, deltaSub }: Props) {
  const config = STAT_CONFIG[type];

  const isPositive = delta === undefined || delta >= 0;
  const deltaColor = isPositive ? "#10b981" : "#ef4444";
  const deltaArrow = isPositive ? "↑" : "↓";

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        position: "relative",
        background: "rgba(255, 255, 255, 0.9)",
        borderRadius: 20,
        border: "1px solid #d8d0c2",
        overflow: "hidden",
        boxShadow: "0 2px 4px rgba(28, 38, 50, 0.04)",
        height: 120,
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: config.bgGradient,
        }}
      />

      {/* Icon background circle */}
      <div
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${config.color}1c`, // soft 11% opacity background tint
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: config.color, // full saturated opacity color!
        }}
      >
        {config.icon}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px" }}>
        {/* Label */}
        <div
          style={{
            color: C.teal,
            fontSize: 11,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.6,
            marginBottom: 8,
          }}
        >
          {config.label}
        </div>

        {/* Value */}
        <div
          style={{
            color: config.color,
            fontSize: 32,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 700,
            lineHeight: "32px",
            marginBottom: 6,
          }}
        >
          {value}
        </div>

        {/* Delta */}
        {(delta !== undefined || deltaSub) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {delta !== undefined && (
              <span
                style={{
                  color: deltaColor,
                  fontSize: 12,
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
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: 0.7,
                }}
              >
                {deltaSub}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
