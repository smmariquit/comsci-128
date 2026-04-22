"use client";

import { useState, useMemo } from "react";
import { C } from "@/lib/palette";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ApplicationStatus =
  | "Pending Manager Approval"
  | "Pending Admin Approval"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export type RoomType = "Women Only" | "Men Only" | "Co-ed";

export interface ApplicationReportRow {
  application_id: number;
  student_name: string;
  student_number: string;
  housing_name: string;
  preferred_room_type: RoomType | null;
  application_status: ApplicationStatus;
  expected_moveout_date: string;
  actual_moveout_date?: string;
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<ApplicationStatus, { bg: string; dot: string; text: string; label: string }> = {
  "Pending Manager Approval": { bg: "rgba(227,175,100,0.18)", dot: "#D4A017", text: "#A07820", label: "Pending Manager" },
  "Pending Admin Approval":   { bg: "rgba(227,175,100,0.18)", dot: "#D4A017", text: "#A07820", label: "Pending Admin"   },
  "Approved":                 { bg: "rgba(86,115,117,0.12)",  dot: C.teal,   text: C.teal,   label: "Approved"         },
  "Rejected":                 { bg: "rgba(201,100,42,0.10)",  dot: C.orange, text: C.orange, label: "Rejected"         },
  "Cancelled":                { bg: "rgba(28,38,50,0.08)",    dot: C.navy,   text: C.navy,   label: "Cancelled"        },
};

const ALL_STATUSES = Object.keys(STATUS_STYLE) as ApplicationStatus[];

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      fontSize: 11, fontWeight: 600,
      padding: "3px 8px", borderRadius: 20, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {s.label}
    </span>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────

type BtnVariant = "ghost" | "danger" | "approve";

const BTN_STYLE: Record<BtnVariant, React.CSSProperties> = {
  ghost:   { background: "#fff",                  color: C.navy,   border: `1px solid ${C.cream}` },
  danger:  { background: "rgba(201,100,42,0.10)", color: C.orange, border: "1px solid rgba(201,100,42,0.2)" },
  approve: { background: "rgba(86,115,117,0.12)", color: C.teal,   border: "1px solid rgba(86,115,117,0.25)" },
};

function ActionBtn({ label, onClick, variant = "ghost", disabled }: {
  label: string; onClick: () => void; variant?: BtnVariant; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...BTN_STYLE[variant],
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11, fontWeight: 300,
      padding: "4px 10px", borderRadius: 6,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
    }}>
      {label}
    </button>
  );
}

// ─── Search ───────────────────────────────────────────────────────────────────

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: "relative", maxWidth: 260 }}>
      <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search student, housing…"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "6px 12px 6px 32px",
          border: `1px solid ${C.cream}`,
          borderRadius: 8, fontSize: 12,
          color: C.navy, outline: "none",
          fontFamily: "'DM Sans', sans-serif",
          boxSizing: "border-box", background: "#fff",
        }}
      />
    </div>
  );
}

// ─── Status Filter ────────────────────────────────────────────────────────────

function StatusFilter({
  value,
  onChange,
  counts,
}: {
  value: ApplicationStatus | "All";
  onChange: (v: ApplicationStatus | "All") => void;
  counts: Record<ApplicationStatus | "All", number>;
}) {
  const options: (ApplicationStatus | "All")[] = ["All", ...ALL_STATUSES];

  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map(opt => {
        const isActive = value === opt;
        const s = opt === "All" ? null : STATUS_STYLE[opt];
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11, fontWeight: 600,
              padding: "4px 10px", borderRadius: 20,
              border: isActive
                ? `1.5px solid ${s ? s.dot : C.navy}`
                : `1.5px solid ${C.cream}`,
              cursor: "pointer",
              background: isActive ? (s ? s.bg : "rgba(28,38,50,0.08)") : "#fff",
              color: isActive ? (s ? s.text : C.navy) : C.teal,
              transition: "all 0.15s",
              display: "inline-flex", alignItems: "center", gap: 5,
            }}
          >
            {opt === "All" ? "All" : s!.label}
            <span style={{
              fontSize: 10, fontWeight: 700,
              padding: "1px 5px", borderRadius: 10,
              background: isActive
                ? "rgba(255,255,255,0.55)"
                : "rgba(28,38,50,0.07)",
              color: isActive ? (s ? s.text : C.navy) : C.teal,
            }}>
              {counts[opt]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Columns ──────────────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "student",    label: "Student"     },
  { key: "student_no", label: "Student No." },
  { key: "housing",    label: "Housing"     },
  { key: "room_type",  label: "Room Type"   },
  { key: "status",     label: "Status"      },
  { key: "actions",    label: "Actions"     },
];

// ─── Table ────────────────────────────────────────────────────────────────────

function ApplicationTable({ data, onView, onApprove, onReject }: {
  data: ApplicationReportRow[];
  onView:    (row: ApplicationReportRow) => void;
  onApprove: (row: ApplicationReportRow) => void;
  onReject:  (row: ApplicationReportRow) => void;
}) {
  const isPending = (row: ApplicationReportRow) =>
    row.application_status === "Pending Admin Approval" ||
    row.application_status === "Pending Manager Approval";

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: C.cream }}>
            {COLUMNS.map(col => (
              <th key={col.key} style={{
                padding: "8px 14px", textAlign: "left",
                fontSize: 10, color: C.teal,
                textTransform: "uppercase",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600, whiteSpace: "nowrap",
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={COLUMNS.length} style={{
                padding: "32px 14px", textAlign: "center",
                color: C.teal, opacity: 0.5, fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                No applications found.
              </td>
            </tr>
          ) : data.map((row, i) => (
            <tr key={row.application_id} style={{
              borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`,
            }}>
              <td style={{ padding: "8px 14px", color: C.navy, fontWeight: 600, whiteSpace: "nowrap" }}>
                {row.student_name}
              </td>
              <td style={{ padding: "8px 14px", color: C.teal, fontFamily: "monospace" }}>
                {row.student_number}
              </td>
              <td style={{ padding: "8px 14px", color: C.navy, fontWeight: 500 }}>
                {row.housing_name}
              </td>
              <td style={{ padding: "8px 14px", color: C.navy }}>
                {row.preferred_room_type ?? <span style={{ opacity: 0.4 }}>—</span>}
              </td>
              <td style={{ padding: "8px 14px" }}>
                <StatusBadge status={row.application_status} />
              </td>
              <td style={{ padding: "8px 14px" }}>
                <div style={{ display: "flex", gap: 4 }}>
                  <ActionBtn label="View" onClick={() => onView(row)} variant="ghost" />
                  {isPending(row) && (
                    <>
                      <ActionBtn label="Approve" onClick={() => onApprove(row)} variant="approve" />
                      <ActionBtn label="Reject"  onClick={() => onReject(row)}  variant="danger"  />
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ApplicationTable_Wrapper({
  liveApplications,
  onView,
  onApprove,
  onReject,
}: {
  liveApplications: ApplicationReportRow[];
  onView?: (row: ApplicationReportRow) => void;
  onApprove?: (row: ApplicationReportRow) => void;
  onReject?: (row: ApplicationReportRow) => void;
}) {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">("Pending Admin Approval");
  const [search, setSearch] = useState("");

  const handleView    = onView    ?? (() => undefined);
  const handleApprove = onApprove ?? (() => undefined);
  const handleReject  = onReject  ?? (() => undefined);

  // counts per status (unaffected by search)
  const counts = useMemo(() => {
    const c = { All: liveApplications.length } as Record<ApplicationStatus | "All", number>;
    for (const s of ALL_STATUSES) {
      c[s] = liveApplications.filter(r => r.application_status === s).length;
    }
    return c;
  }, [liveApplications]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return liveApplications.filter(r => {
      const matchStatus = statusFilter === "All" || r.application_status === statusFilter;
      const matchSearch = !q ||
        r.student_name.toLowerCase().includes(q) ||
        r.student_number.toLowerCase().includes(q) ||
        r.housing_name.toLowerCase().includes(q) ||
        (r.preferred_room_type ?? "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [liveApplications, statusFilter, search]);

  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      outline: `1px solid ${C.cream}`,
      overflow: "hidden",
      fontFamily: "'DM Sans', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px",
        borderBottom: `1px solid ${C.dividerLight}`,
        flexWrap: "wrap", gap: 10,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Applications</div>
          <div style={{ fontSize: 11, color: C.teal }}>{filtered.length} shown</div>
        </div>
        <SearchInput value={search} onChange={setSearch} />
      </div>

      {/* Status Filter Pills */}
      <div style={{
        padding: "10px 18px",
        borderBottom: `1px solid ${C.dividerLight}`,
      }}>
        <StatusFilter value={statusFilter} onChange={setStatusFilter} counts={counts} />
      </div>

      {/* Table */}
      <ApplicationTable
        data={filtered}
        onView={handleView}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
