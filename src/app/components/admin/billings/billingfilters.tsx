"use client";

import { Search } from "lucide-react";
import { C } from "@/lib/palette";
import type { PaymentStatus, BillType } from "./billingtable";

export type StatusFilter   = "All" | PaymentStatus;
export type BillTypeFilter = "All" | BillType;

interface Props {
  search:         string;
  status:         StatusFilter;
  billType:       BillTypeFilter;
  housing:        string;
  housingOptions: string[];
  dueDateFrom:    string;
  dueDateTo:      string;
  onSearch:       (v: string)          => void;
  onStatus:       (v: StatusFilter)    => void;
  onBillType:     (v: BillTypeFilter)  => void;
  onHousing:      (v: string)          => void;
  onDueDateFrom:  (v: string)          => void;
  onDueDateTo:    (v: string)          => void;
}

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
  boxSizing: "border-box" as const,
};

const selectBase: React.CSSProperties = {
  ...inputBase,
  cursor: "pointer",
  appearance: "auto" as const,
  paddingRight: 12,
};

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 600,
  color: C.teal,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  marginBottom: 4,
  display: "block",
  fontFamily: "'DM Sans', sans-serif",
};

export default function BillFilters({
  search, status, billType, housing, housingOptions,
  dueDateFrom, dueDateTo,
  onSearch, onStatus, onBillType, onHousing, onDueDateFrom, onDueDateTo,
}: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Row 1 — search + dropdowns */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>

        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 180px", minWidth: 160 }}>
          <Search
            size={14}
            color={C.teal}
            strokeWidth={2}
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          />
          <input
            type="text"
            placeholder="Search student name..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ ...inputBase, width: "100%", paddingLeft: 32 }}
          />
        </div>

        {/* Property */}
        <select
          title="Filter by property"
          aria-label="Filter by property"
          value={housing}
          onChange={(e) => onHousing(e.target.value)}
          style={{ ...selectBase, minWidth: 180 }}
        >
          <option value="All">All Properties</option>
          {housingOptions.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>

        {/* Bill type */}
        <select
          title="Filter by bill type"
          aria-label="Filter by bill type"
          value={billType}
          onChange={(e) => onBillType(e.target.value as BillTypeFilter)}
          style={{ ...selectBase, minWidth: 150 }}
        >
          {(["All", "Rent", "Utility", "Maintenance", "Miscellaneous"] as BillTypeFilter[]).map((t) => (
            <option key={t} value={t}>{t === "All" ? "All Types" : t}</option>
          ))}
        </select>

        {/* Status */}
        <select
          title="Filter by status"
          aria-label="Filter by status"
          value={status}
          onChange={(e) => onStatus(e.target.value as StatusFilter)}
          style={{ ...selectBase, minWidth: 140 }}
        >
          {(["All", "Pending", "Paid", "Overdue"] as StatusFilter[]).map((s) => (
            <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>
          ))}
        </select>
      </div>

      {/* Row 2 — due date range */}
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={labelStyle}>Due Date From</span>
          <input
            type="date"
            value={dueDateFrom}
            onChange={(e) => onDueDateFrom(e.target.value)}
            style={{ ...inputBase, minWidth: 150 }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={labelStyle}>Due Date To</span>
          <input
            type="date"
            value={dueDateTo}
            onChange={(e) => onDueDateTo(e.target.value)}
            style={{ ...inputBase, minWidth: 150 }}
          />
        </div>

        {/* Clear dates shortcut */}
        {(dueDateFrom || dueDateTo) && (
          <button
            onClick={() => { onDueDateFrom(""); onDueDateTo(""); }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              color: C.orange,
              background: "rgba(201,100,42,0.08)",
              border: `1px solid rgba(201,100,42,0.2)`,
              borderRadius: 8,
              padding: "0 12px",
              height: 36,
              cursor: "pointer",
            }}
          >
            Clear dates
          </button>
        )}
      </div>
    </div>
  );
}