
"use client";

import { C } from "@/lib/palette";
import { Search } from "lucide-react";

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
  appearance: "none",
  paddingRight: 28,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23567375' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
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
          style={{
            position: "absolute",
            left: 10,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
          size={14}
          color={C.teal}
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