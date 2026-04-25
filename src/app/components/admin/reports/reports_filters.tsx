"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { C } from "@/lib/palette";
import type { ReportType } from "@/app/components/admin/reports/reports_wrapper";

interface Props {
  reportType:     ReportType;
  search:         string;
  housing:        string;
  housingOptions: string[];
  status:         string;
  dateFrom:       string;
  dateTo:         string;
  onSearch:       (v: string) => void;
  onHousing:      (v: string) => void;
  onStatus:       (v: string) => void;
  onDateFrom:     (v: string) => void;
  onDateTo:       (v: string) => void;
}

const inputBase: React.CSSProperties = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 12, color: C.navy, background: "#fff",
  border: `1px solid ${C.cream}`, borderRadius: 8,
  padding: "8px 12px", outline: "none",
  height: 36, boxSizing: "border-box" as const,
};

const selectBase: React.CSSProperties = {
  ...inputBase, cursor: "pointer",
  paddingRight: 12,
  appearance: "auto" as const,
};

const labelStyle: React.CSSProperties = {
  fontSize: 10, fontWeight: 600, color: C.teal,
  textTransform: "uppercase", letterSpacing: "0.04em",
  marginBottom: 4, display: "block",
  fontFamily: "'DM Sans', sans-serif",
};

// Status options per report type
const STATUS_OPTIONS: Record<ReportType, { label: string; value: string }[]> = {
  occupancy: [
    { value: "All",               label: "All Statuses" },
    { value: "Empty",             label: "Empty" },
    { value: "Partially Occupied",          label: "Partially Occupied" },
    { value: "Fully Occupied",          label: "Fully Occupied" },
    // { value: "Under Maintenance", label: "Under Maintenance" },
  ],
  application: [
    { value: "All",       label: "All Statuses" },
    { value: "Pending Manager Approval",   label: "Pending Manager Approval" },
    { value: "Pending Admin Approval",   label: "Pending Admin Approval" },
    { value: "Approved",  label: "Approved" },
    { value: "Rejected",  label: "Rejected" },
    { value: "Cancelled", label: "Cancelled" },
  ],
  revenue: [
    { value: "All",     label: "All Statuses" },
    { value: "Paid",    label: "Paid" },
    { value: "Pending", label: "Pending" },
    { value: "Overdue", label: "Overdue" },
  ],
  accommodation: [
    { value: "All",      label: "All Types" },
    { value: "Men Only",   label: "Men Only" },
    { value: "Women Only",   label: "Women Only" },
    { value: "Co-ed",    label: "Co-ed" },
  ],
};

const SEARCH_PLACEHOLDER: Record<ReportType, string> = {
  occupancy:     "Search room code...",
  application:   "Search student name, number...",
  revenue:       "Search student name...",
  accommodation: "Search student name, room...",
};

const STATUS_LABEL: Record<ReportType, string> = {
  occupancy:     "Occupancy Status",
  application:   "Application Status",
  revenue:       "Payment Status",
  accommodation: "Room Type",
};

const SHOW_DATE: Record<ReportType, boolean> = {
  occupancy:     false,
  application:   true,
  revenue:       true,
  accommodation: true,
};

export default function ReportFilters({
  reportType, search, housing, housingOptions, status,
  dateFrom, dateTo, onSearch, onHousing, onStatus, onDateFrom, onDateTo,
}: Props) {
  const showDate = SHOW_DATE[reportType];
  const [hoveredInput, setHoveredInput] = useState(false);
  const [hoveredSelect, setHoveredSelect] = useState<string | null>(null);
  const [hoveredFrom, setHoveredFrom] = useState(false);
  const [hoveredTo, setHoveredTo] = useState(false);
  const [hoveredClear, setHoveredClear] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Row 1 */}
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        {/* Search */}
        <div style={{ position: "relative", flex: "1 1 180px", minWidth: 160, transform: hoveredInput ? "translateY(-1px)" : "translateY(0)", transition: "transform 0.15s ease" }}>
          <Search
            size={14}
            color={C.teal}
            strokeWidth={2}
            style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }}
          />
          <input
            type="text"
            placeholder={SEARCH_PLACEHOLDER[reportType]}
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            onMouseEnter={() => setHoveredInput(true)}
            onMouseLeave={() => setHoveredInput(false)}
            style={{ ...inputBase, width: "100%", paddingLeft: 32, boxShadow: hoveredInput ? "0 8px 18px rgba(28,38,50,0.08)" : "none", outlineColor: hoveredInput ? C.amber : C.cream }}
          />
        </div>

        {/* Property */}
        <select
          title="Filter by property" aria-label="Filter by property"
          value={housing} onChange={(e) => onHousing(e.target.value)}
          onMouseEnter={() => setHoveredSelect("housing")}
          onMouseLeave={() => setHoveredSelect((current) => (current === "housing" ? null : current))}
          style={{ ...selectBase, minWidth: 200, boxShadow: hoveredSelect === "housing" ? "0 8px 18px rgba(28,38,50,0.08)" : "none", outlineColor: hoveredSelect === "housing" ? C.amber : C.cream }}
        >
          <option value="All">All Properties</option>
          {housingOptions.map((h) => <option key={h} value={h}>{h}</option>)}
        </select>

        {/* Status / room type */}
        <select
          title={`Filter by ${STATUS_LABEL[reportType]}`}
          aria-label={`Filter by ${STATUS_LABEL[reportType]}`}
          value={status} onChange={(e) => onStatus(e.target.value)}
          onMouseEnter={() => setHoveredSelect("status")}
          onMouseLeave={() => setHoveredSelect((current) => (current === "status" ? null : current))}
          style={{ ...selectBase, minWidth: 170, boxShadow: hoveredSelect === "status" ? "0 8px 18px rgba(28,38,50,0.08)" : "none", outlineColor: hoveredSelect === "status" ? C.amber : C.cream }}
        >
          {STATUS_OPTIONS[reportType].map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Row 2 — date range (only for applicable reports) */}
      {showDate && (
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={labelStyle}>Date From</span>
            <input type="date" value={dateFrom} onChange={(e) => onDateFrom(e.target.value)} onMouseEnter={() => setHoveredFrom(true)} onMouseLeave={() => setHoveredFrom(false)}
              style={{ ...inputBase, minWidth: 150, boxShadow: hoveredFrom ? "0 8px 18px rgba(28,38,50,0.08)" : "none", outlineColor: hoveredFrom ? C.amber : C.cream }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={labelStyle}>Date To</span>
            <input type="date" value={dateTo} onChange={(e) => onDateTo(e.target.value)} onMouseEnter={() => setHoveredTo(true)} onMouseLeave={() => setHoveredTo(false)}
              style={{ ...inputBase, minWidth: 150, boxShadow: hoveredTo ? "0 8px 18px rgba(28,38,50,0.08)" : "none", outlineColor: hoveredTo ? C.amber : C.cream }} />
          </div>
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { onDateFrom(""); onDateTo(""); }}
              onMouseEnter={() => setHoveredClear(true)}
              onMouseLeave={() => setHoveredClear(false)}
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 11,
                color: C.orange, background: "rgba(201,100,42,0.08)",
                border: `1px solid rgba(201,100,42,0.2)`,
                borderRadius: 8, padding: "0 12px", height: 36, cursor: "pointer",
                transform: hoveredClear ? "translateY(-1px)" : "translateY(0)",
                boxShadow: hoveredClear ? "0 6px 14px rgba(201,100,42,0.12)" : "none",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
            >
              Clear dates
            </button>
          )}
        </div>
      )}
    </div>
  );
}