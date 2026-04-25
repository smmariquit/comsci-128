"use client";

import { Search } from "lucide-react";
import { C } from "@/lib/palette";

// ── Types ─────────────────────────────────────────────────────────────────────

export type ActionFilter =
  | "All"
  | "LOGIN"
  | "APPROVE_APPLICATION"
  | "ASSIGN_ROOM"
  | "BILL_UPDATE"
  | "LOGOUT";

interface Props {
  search: string;
  action: ActionFilter;
  onSearch: (v: string) => void;
  onAction: (v: ActionFilter) => void;
}

// ── Shared Styles (same as your RoomFilters) ──────────────────────────────────

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
  boxSizing: "border-box",
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  cursor: "pointer",
  appearance: "auto",
  paddingRight: 12,
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function AuditLogFilters({
  search,
  action,
  onSearch,
  onAction,
}: Props) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
      
      {/* Search */}
      <div style={{ position: "relative", flex: "1 1 180px", minWidth: 160 }}>
        <Search
          size={14}
          color={C.teal}
          strokeWidth={2}
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />

        <input
          type="text"
          placeholder="Search user, action..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{ ...inputBase, width: "100%", paddingLeft: 32 }}
        />
      </div>

      {/* Action Type */}
      <select
        title="Filter by action"
        aria-label="Filter by action"
        value={action}
        onChange={(e) => onAction(e.target.value as ActionFilter)}
        style={{ ...selectBase, minWidth: 180 }}
      >
        <option value="All">All Actions</option>
        <option value="LOGIN">Login</option>
        <option value="APPROVE_APPLICATION">Approvals</option>
        <option value="ASSIGN_ROOM">Assignments</option>
        <option value="BILL_UPDATE">Billing</option>
        <option value="LOGOUT">Logout</option>
      </select>

    </div>
  );
}