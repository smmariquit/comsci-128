"use client";

import { useState } from "react";
import { C } from "@/lib/palette";

export interface AuditLogRow {
  audit_id: number;
  timestamp: string;
  action_type: string;
  audit_description: string;
  user_name: string;
}

const ACTION_STYLES: Record<string, { bg: string; text: string }> = {
  Create: C.actionCreate,
  Update: C.actionUpdate,
  Delete: C.actionDelete,
  Login:  C.actionLogin,
  Logout: C.actionLogout,
};

const FALLBACK = { bg: C.cream, text: C.teal };

interface Props {
  data: AuditLogRow[];
}

export default function RecentAuditLog({ data }: Props) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState(false);

  if (data.length === 0) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          outline: `1px solid ${C.cream}`,
          outlineOffset: -1,
          fontFamily: "'DM Sans', sans-serif",
          overflow: "hidden",
          paddingBottom: 18,
        }}
      >
        <div style={{ padding: "18px 24px 14px", borderBottom: `1px solid ${C.dividerLight}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Recent Audit Activity</div>
          <div style={{ fontSize: 11, color: C.teal, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
            Latest system actions
          </div>
        </div>
        <div style={{ padding: "28px 24px", textAlign: "center", color: C.teal }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.navy, marginBottom: 4 }}>No audit events yet</div>
          <div style={{ fontSize: 11 }}>Activity logs will appear here when actions are recorded.</div>
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
        overflow: "hidden",
        transform: hoveredCard ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hoveredCard ? "0 12px 24px rgba(28,38,50,0.08)" : "none",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, outline-color 0.18s ease",
        outlineColor: hoveredCard ? C.amber : C.cream,
      }}
    >
      {/* Header */}
      <div style={{ padding: "18px 24px 14px", borderBottom: `1px solid ${C.dividerLight}` }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Recent Audit Activity</div>
        <div style={{ fontSize: 11, color: C.teal, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
          Latest system actions
        </div>
      </div>

      {/* Feed */}
      <div style={{ padding: "8px 0" }}>
        {data.map((entry, i) => {
          const style = ACTION_STYLES[entry.action_type] ?? FALLBACK;
          return (
            <div
              key={entry.audit_id}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 24px",
                borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`,
                alignItems: "flex-start",
                background: hoveredRow === i ? "rgba(28,38,50,0.03)" : "transparent",
                transition: "background 0.15s ease",
              }}
            >
              {/* Action badge */}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 20,
                  background: style.bg,
                  color: style.text,
                  whiteSpace: "nowrap",
                  marginTop: 2,
                  flexShrink: 0,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {entry.action_type}
              </span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: C.navy, fontWeight: 500 }}>
                  {entry.audit_description}
                </div>
                <div style={{ fontSize: 11, color: C.teal, marginTop: 3, fontFamily: "'DM Mono', monospace" }}>
                  by{" "}
                  <span style={{ color: C.orange, fontWeight: 600 }}>{entry.user_name}</span>
                  {" · "}
                  {entry.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}