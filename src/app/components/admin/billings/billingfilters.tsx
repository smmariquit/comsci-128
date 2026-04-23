"use client";

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
  appearance: "none" as const,
  paddingRight: 28,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23567375' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 10px center",
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
          <svg
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
            width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
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