import { C } from "@/lib/palette";
import type { AuditLogRow } from "./audit";
import { ActionType } from "@/app/lib/models/audit_log";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

// ── Action Badge ──────────────────────────────────────────────────────────────

const ACTION_STYLES: Record<
  ActionType,
  { bg: string; text: string; accent: string }
> = {
  "Application Status": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    accent: "#3b82f6",
  },
  "Bill Status": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    accent: "#f59e0b",
  },
  "Auth Register": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    accent: "#10b981",
  },
  "Auth Login": {
    bg: "bg-orange-50",
    text: "text-orange-700",
    accent: "#f97316",
  },
  "Change Auth Password": {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    accent: "#eab308",
  },
  "Delete Account": {
    bg: "bg-rose-50",
    text: "text-rose-700",
    accent: "#f43f5e",
  },
  "Update User Role": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    accent: "#a855f7",
  },
  "Submit Application": {
    bg: "bg-sky-50",
    text: "text-sky-700",
    accent: "#0ea5e9",
  },
  "Update Application Status": {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    accent: "#6366f1",
  },
  "Withdraw Application": {
    bg: "bg-red-50",
    text: "text-red-700",
    accent: "#ef4444",
  },
  "Create Housing": {
    bg: "bg-teal-50",
    text: "text-teal-700",
    accent: "#14b8a6",
  },
  "Update Housing": {
    bg: "bg-cyan-50",
    text: "text-cyan-700",
    accent: "#06b6d4",
  },
  "Assign Room": {
    bg: "bg-lime-50",
    text: "text-lime-700",
    accent: "#84cc16",
  },
  "Assign Bill": {
    bg: "bg-orange-50",
    text: "text-orange-700",
    accent: "#f97316",
  },
  "Update Bill Status": {
    bg: "bg-amber-50",
    text: "text-amber-700",
    accent: "#f59e0b",
  },
  "Issue Bill Refund": {
    bg: "bg-green-50",
    text: "text-green-700",
    accent: "#22c55e",
  },
  "Update User Details": {
    bg: "bg-purple-50",
    text: "text-purple-700",
    accent: "#a855f7",
  },
};

function ActionBadge({ type }: { type: ActionType }) {
  const style = ACTION_STYLES[type] || ACTION_STYLES["Application Status"];
  const accentColor = style.accent;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        paddingLeft: 8,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 8,
        background: accentColor + "15",
        border: `1px solid ${accentColor}30`,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: accentColor,
        }}
      />
      <span
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color: accentColor,
          letterSpacing: "0.3px",
          textTransform: "uppercase",
        }}
      >
        {type}
      </span>
    </div>
  );
}

interface Props {
  data: any[];
  onView?: (row: any) => void;
}

// ── Table ─────────────────────────────────────────────────────────────────────

export default function AuditLogTable({ data, onView }: Props) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* Header */}
      <div style={{ padding: "0 4px 16px 4px" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
          Audit Logs
        </div>
        <div style={{ fontSize: 13, color: C.teal, marginTop: 2 }}>
          {data.length} total event{data.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Log rows as cards */}
      {data.map((row) => (
        <div
          key={row.audit_id}
          onClick={() =>
            setExpandedId(expandedId === row.audit_id ? null : row.audit_id)
          }
          style={{
            background: "#fff",
            border: `1px solid ${C.cream}`,
            borderRadius: 12,
            padding: 16,
            cursor: "pointer",
            transition: "all 0.25s ease",
            transform: expandedId === row.audit_id ? "scale(1.01)" : "scale(1)",
            boxShadow:
              expandedId === row.audit_id
                ? "0 8px 16px rgba(28, 38, 50, 0.1)"
                : "0 2px 4px rgba(28, 38, 50, 0.06)",
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.style.boxShadow.includes("0 8px")) {
              e.currentTarget.style.boxShadow =
                "0 4px 8px rgba(28, 38, 50, 0.08)";
              e.currentTarget.style.borderColor = C.cream;
            }
          }}
          onMouseLeave={(e) => {
            if (expandedId !== row.audit_id) {
              e.currentTarget.style.boxShadow =
                "0 2px 4px rgba(28, 38, 50, 0.06)";
              e.currentTarget.style.borderColor = C.cream;
            }
          }}
        >
          {/* Main row content */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "120px 140px 1fr auto",
              gap: 16,
              alignItems: "center",
            }}
          >
            {/* Timestamp */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: C.teal,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                  marginBottom: 4,
                }}
              >
                When
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: C.navy,
                  fontWeight: 500,
                }}
              >
                {new Date(row.timestamp).toLocaleDateString()}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.teal,
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                {new Date(row.timestamp).toLocaleTimeString()}
              </div>
            </div>

            {/* User */}
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: C.teal,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                  marginBottom: 4,
                }}
              >
                User
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: C.navy,
                  fontWeight: 500,
                }}
              >
                {row.user_name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.teal,
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                #{row.account_number}
              </div>
            </div>

            {/* Action & Description combined */}
            <div>
              <ActionBadge type={row.action_type} />
              <div
                style={{
                  fontSize: 13,
                  color: C.navy,
                  marginTop: 8,
                  lineHeight: 1.5,
                }}
              >
                {row.audit_description}
              </div>
            </div>

            {/* Expand indicator */}
            <div
              style={{
                color: C.teal,
                transition: "transform 0.25s ease",
                transform:
                  expandedId === row.audit_id
                    ? "rotate(90deg)"
                    : "rotate(0deg)",
              }}
            >
              <ChevronRight size={20} />
            </div>
          </div>

          {/* Expanded Details (optional) */}
          {expandedId === row.audit_id && (
            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: `1px solid ${C.cream}`,
                display: "flex",
                gap: 16,
                fontSize: 12,
              }}
            >
              <div>
                <div
                  style={{ color: C.teal, fontWeight: 600, marginBottom: 4 }}
                >
                  IP Address
                </div>
                <div style={{ color: C.navy, fontFamily: "monospace" }}>
                  {row.partial_ip || "—"}
                </div>
              </div>
              <div>
                <div
                  style={{ color: C.teal, fontWeight: 600, marginBottom: 4 }}
                >
                  Log ID
                </div>
                <div style={{ color: C.navy, fontFamily: "monospace" }}>
                  {row.audit_id}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
