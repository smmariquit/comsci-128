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
  onSearch: (v: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrder: (v: "asc" | "desc") => void;
}

// ── Shared Styles (same as your RoomFilters) ──────────────────────────────────

const inputBase: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
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
  onSearch,
  sortOrder,
  onSortOrder,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
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
          placeholder="Search by Account Number..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{ ...inputBase, width: "100%", paddingLeft: 32 }}
        />
      </div>

      {/* Sort by Timestamp dropdown */}
      <select
        title="Sort by Timestamp"
        aria-label="Sort by Timestamp"
        value={sortOrder}
        onChange={(e) => onSortOrder(e.target.value as "asc" | "desc")}
        style={{ ...selectBase, minWidth: 180 }}
      >
        <option value="desc">Timestamp (Newest First)</option>
        <option value="asc">Timestamp (Oldest First)</option>
      </select>
    </div>
  );
}
