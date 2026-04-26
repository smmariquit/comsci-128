"use client";

import { useState, useMemo, useEffect } from "react";
import { LoaderCircle, Search } from "lucide-react";
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
  account_number: number;
  student_name: string;
  student_number: string;
  housing_name: string;
  housing_id: number;
  room_id?: number;
  room_code?: string;
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

// ─── Loading Spinner ──────────────────────────────────────────────────────────

function Spinner({ color = "currentColor" }: { color?: string }) {
  return (
    <>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      <LoaderCircle
        size={12}
        color={color}
        strokeWidth={3}
        style={{ animation: "spin 1s linear infinite", display: "block" }}
      />
    </>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────

type BtnVariant = "ghost" | "danger" | "approve";

const BTN_STYLE: Record<BtnVariant, React.CSSProperties> = {
  ghost:   { background: "#fff",                  color: C.navy,   border: `1px solid ${C.cream}` },
  danger:  { background: "rgba(201,100,42,0.10)", color: C.orange, border: "1px solid rgba(201,100,42,0.2)" },
  approve: { background: "rgba(86,115,117,0.12)", color: C.teal,   border: "1px solid rgba(86,115,117,0.25)" },
};

function ActionBtn({ label, onClick, variant = "ghost", disabled, isLoading }: {
  label: string; onClick: () => void; variant?: BtnVariant; disabled?: boolean; isLoading?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled || isLoading}
      style={{
        ...BTN_STYLE[variant],
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 6,
        cursor: (disabled || isLoading) ? "not-allowed" : "pointer",
        opacity: (disabled || isLoading) ? 0.6 : 1,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
        minWidth: 60,
        transform: hovered && !(disabled || isLoading) ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered && !(disabled || isLoading) ? "0 6px 14px rgba(28,38,50,0.08)" : "none",
        transition: "all 0.15s ease",
      }}
    >
      {isLoading ? <Spinner /> : label}
    </button>
  );
}

// ─── Search ───────────────────────────────────────────────────────────────────

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180, maxWidth: 360 }}>
      <Search
        size={14}
        color={C.teal}
        strokeWidth={2}
        style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
      />
      <input
        type="text"
        placeholder="Search student, housing…"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%",
          height: 36,
          padding: "8px 12px 8px 32px",
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

// ─── Table ────────────────────────────────────────────────────────────────────

function ApplicationTable({ data, onView, onApproveInit, onRejectInit }: {
  data: ApplicationReportRow[];
  onView:        (row: ApplicationReportRow) => void;
  onApproveInit: (row: ApplicationReportRow) => void;
  onRejectInit:  (row: ApplicationReportRow) => void;
}) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const isPending = (row: ApplicationReportRow) =>
    row.application_status === "Pending Admin Approval" 

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
            <tr
              key={row.application_id}
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight || "rgba(0,0,0,0.05)"}`,
                background: hoveredRow === i ? "rgba(28,38,50,0.03)" : "transparent",
                transition: "background 0.15s ease",
              }}
            >
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
                      <ActionBtn label="Approve" onClick={() => onApproveInit(row)} variant="approve" />
                      <ActionBtn label="Reject"  onClick={() => onRejectInit(row)}  variant="danger"  />
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

// ─── Columns ──────────────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "student",    label: "Student"     },
  { key: "student_no", label: "Student No." },
  { key: "housing",    label: "Housing"     },
  { key: "room_type",  label: "Room Type"   },
  { key: "status",     label: "Status"      },
  { key: "actions",    label: "Actions"     },
];

// ─── Confirmation Modal ───────────────────────────────────────────────────────

type ModalConfig = { action: "approve" | "reject"; row: ApplicationReportRow } | null;

type AvailableRoom = { room_id: number; room_code: string; available_beds: number };

function ConfirmModal({
  config,
  onClose,
  onConfirm,
  isProcessing
}) {
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [overrideRoomId, setOverrideRoomId] = useState<string>(""); 

  const isApprove = config?.action === "approve";

  useEffect(() => {
    if (isApprove && config.row) {
      const fetchRooms = async () => {
        setIsLoadingRooms(true);
        try {
          const res = await fetch(`/api/rooms/available?housingId=${config.row.housing_id}&roomType=${config.row.preferred_room_type}`);
          const data = await res.json();
          setAvailableRooms(data.availableRooms || []);
        } catch (e) {
          console.error("Failed to fetch available rooms", e);
        } finally {
          setIsLoadingRooms(false);
        }
      };
      fetchRooms();
    } else {
      setAvailableRooms([]);
      setOverrideRoomId(""); 
    }
  }, [isApprove, config]);

  if (!config) return null;

  const actionText = isApprove ? "Approve & Assign" : "Reject";
  const titleColor = isApprove ? C.teal : C.orange;
  const finalRoomToSubmit = overrideRoomId ? Number(overrideRoomId) : config.row.room_id;

  const tentativeRoomDisplay = config.row.room_code 
    ? `Room ${config.row.room_code}` 
    : (config.row.room_id ? `Room ID: ${config.row.room_id}` : "None Assigned");

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(28,38,50,0.4)", backdropFilter: "blur(2px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: 20
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, width: "100%", maxWidth: 400,
        padding: 24, fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 10px 25px rgba(28,38,50,0.1)",
        outline: `1px solid ${C.cream}`
      }}>
        <h3 style={{ margin: "0 0 8px 0", fontSize: 16, fontWeight: 600, color: titleColor }}>
          Confirm {isApprove ? "Approval" : "Rejection"}
        </h3>
        <p style={{ margin: "0 0 20px 0", fontSize: 13, color: C.navy, lineHeight: 1.5 }}>
          Are you sure you want to <strong>{isApprove ? "approve" : "reject"}</strong> the housing application for <span style={{ color: C.teal, fontWeight: 500 }}>{config.row.student_name}</span>? 
        </p>

        {isApprove && (
          <div style={{ marginBottom: 24, padding: "16px", background: "rgba(86,115,117,0.03)", borderRadius: 8, border: `1px solid ${C.cream}` }}>
            
            {/* Manager's Tentative Assignment */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.teal, textTransform: "uppercase", marginBottom: 4 }}>
                Tentative Assignment
              </label>
              <div style={{ fontSize: 14, color: C.navy, fontWeight: 500 }}>
                {tentativeRoomDisplay} {/* 👈 Using the centralized variable */}
                <span style={{ fontSize: 12, color: C.teal, marginLeft: 8, fontWeight: 400 }}>({config.row.preferred_room_type})</span>
              </div>
            </div>

            {/* Override Dropdown */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.navy, marginBottom: 8 }}>
                Re-assign to another room?
              </label>
              
              {isLoadingRooms ? (
                <div style={{ fontSize: 12, color: C.teal, display: "flex", alignItems: "center", gap: 6 }}>
                  <Spinner color={C.teal} /> Fetching available rooms...
                </div>
              ) : (
                <select
                  value={overrideRoomId}
                  onChange={(e) => setOverrideRoomId(e.target.value)}
                  style={{
                    width: "100%", padding: "10px 12px", borderRadius: 8,
                    border: `1px solid ${C.cream}`, outline: "none",
                    fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: C.navy,
                    background: "#fff"
                  }}
                >
                  <option value="">No (Keep {tentativeRoomDisplay})</option>
                  
                  {availableRooms
                    .filter(room => room.room_id !== config.row.room_id)
                    .map(room => (
                      <option key={room.room_id} value={room.room_id}>
                        Room {room.room_code} ({room.available_beds} beds left)
                      </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}
        
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <ActionBtn label="Cancel" variant="ghost" onClick={onClose} disabled={isProcessing} />
          <ActionBtn 
            label={actionText} 
            variant={isApprove ? "approve" : "danger"} 
            onClick={() => onConfirm(finalRoomToSubmit)} 
            isLoading={isProcessing} 
            disabled={isApprove && !finalRoomToSubmit} 
          />
        </div>
      </div>
    </div>
  );
}

// ─── View Modal ──────────────────────────────────────────────────────────────

function ViewModal({
  row,
  onClose,
}: {
  row: ApplicationReportRow | null;
  onClose: () => void;
}) {
  if (!row) return null;

  const detailRows: Array<{ label: string; value: React.ReactNode }> = [
    { label: "Student", value: row.student_name },
    { label: "Student Number", value: row.student_number },
    { label: "Housing", value: row.housing_name },
    { label: "Preferred Room Type", value: row.preferred_room_type ?? <span style={{ opacity: 0.45 }}>—</span> },
    {
      label: "Expected Move-Out",
      value: row.expected_moveout_date ? new Date(row.expected_moveout_date).toLocaleDateString() : <span style={{ opacity: 0.45 }}>—</span>,
    },
    {
      label: "Actual Move-Out",
      value: row.actual_moveout_date ? new Date(row.actual_moveout_date).toLocaleDateString() : <span style={{ opacity: 0.45 }}>—</span>,
    },
  ];

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(28,38,50,0.4)", backdropFilter: "blur(2px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: 20
    }}>
      <div style={{
        background: "#fff", borderRadius: 12, width: "100%", maxWidth: 460,
        padding: 24, fontFamily: "'DM Sans', sans-serif",
        boxShadow: "0 10px 25px rgba(28,38,50,0.1)",
        outline: `1px solid ${C.cream}`
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: C.navy }}>
            Application Details
          </h3>
          <StatusBadge status={row.application_status} />
        </div>

        <div style={{
          border: `1px solid ${C.dividerLight || "rgba(0,0,0,0.05)"}`,
          borderRadius: 10,
          overflow: "hidden",
          marginBottom: 20,
        }}>
          {detailRows.map((item, idx) => (
            <div
              key={item.label}
              style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr",
                gap: 10,
                padding: "10px 12px",
                borderTop: idx === 0 ? "none" : `1px solid ${C.dividerLight || "rgba(0,0,0,0.05)"}`,
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 11, color: C.teal, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.2 }}>
                {item.label}
              </span>
              <span style={{ fontSize: 13, color: C.navy, fontWeight: 500 }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <ActionBtn label="Close" variant="ghost" onClick={onClose} />
        </div>
      </div>
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
  onApprove?: (row: ApplicationReportRow) => void | Promise<void>;
  onReject?: (row: ApplicationReportRow) => void | Promise<void>;
}) {
  const [applications, setApplications] = useState<ApplicationReportRow[]>(liveApplications);
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "All">("Pending Admin Approval");
  const [search, setSearch] = useState("");
  
  // Modal & Loading States
  const [modalConfig, setModalConfig] = useState<ModalConfig>(null);
  const [viewRow, setViewRow] = useState<ApplicationReportRow | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleView = (row: ApplicationReportRow) => {
    setViewRow(row);
    onView?.(row);
  };

  useEffect(() => {
    setApplications(liveApplications);
  }, [liveApplications]);

  const patchApplicationStatus = async (
    applicationId: number,
    status: ApplicationStatus
  ) => {
    const response = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ application_status: status }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.message ?? "Failed to update application status.");
    }
  };

  const handleConfirmAction = async (finalRoomId?: number) => {
    if (!modalConfig) return;
    setIsProcessing(true);
    
    try {
      if (modalConfig.action === "approve") {
        if (!finalRoomId) throw new Error("Cannot approve: No room has been assigned.");

        const response = await fetch(`/api/applications/${modalConfig.row.application_id}/assign`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomId: finalRoomId, 
            studentAccountNumber: modalConfig.row.account_number,
            moveoutDate: modalConfig.row.expected_moveout_date
          }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.message ?? "Failed to assign room.");
        }

        setApplications(prev => prev.map(app =>
          app.application_id === modalConfig.row.application_id
            ? { ...app, application_status: "Approved", room_id: finalRoomId } 
            : app
        ));

      } else {
        // Reject workflow uses the original basic PATCH
        await patchApplicationStatus(modalConfig.row.application_id, "Rejected");
        
        setApplications(prev => prev.map(app =>
          app.application_id === modalConfig.row.application_id
            ? { ...app, application_status: "Rejected" }
            : app
        ));
      }
    } catch (error) {
      console.error("Failed action:", error);
      alert(error instanceof Error ? error.message : "Failed to process application");
    } finally {
      setIsProcessing(false);
      setModalConfig(null);
    }
  };

  // counts per status (unaffected by search)
  const counts = useMemo(() => {
    const c = { All: applications.length } as Record<ApplicationStatus | "All", number>;
    for (const s of ALL_STATUSES) {
      c[s] = applications.filter(r => r.application_status === s).length;
    }
    return c;
  }, [applications]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return applications.filter(r => {
      const matchStatus = statusFilter === "All" || r.application_status === statusFilter;
      const matchSearch = !q ||
        r.student_name.toLowerCase().includes(q) ||
        r.student_number.toLowerCase().includes(q) ||
        r.housing_name.toLowerCase().includes(q) ||
        (r.preferred_room_type ?? "").toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [applications, statusFilter, search]);

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        fontFamily: "'DM Sans', sans-serif",
      }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <SearchInput value={search} onChange={setSearch} />
        </div>

        <div style={{
          background: "#fff", borderRadius: 12,
          outline: `1px solid ${C.cream}`,
          overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          boxShadow: "0 0 0 rgba(0,0,0,0)",
        }}>

          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 18px",
            borderBottom: `1px solid ${C.dividerLight || "rgba(0,0,0,0.05)"}`,
            flexWrap: "wrap", gap: 10,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Applications</div>
              <div style={{ fontSize: 11, color: C.teal }}>{filtered.length} shown</div>
            </div>
          </div>

          {/* Status Filter Pills */}
          <div style={{
            padding: "10px 18px",
            borderBottom: `1px solid ${C.dividerLight || "rgba(0,0,0,0.05)"}`,
          }}>
            <StatusFilter value={statusFilter} onChange={setStatusFilter} counts={counts} />
          </div>

          {/* Table */}
          <ApplicationTable
            data={filtered}
            onView={handleView}
            onApproveInit={(row) => setModalConfig({ action: "approve", row })}
            onRejectInit={(row) => setModalConfig({ action: "reject", row })}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal 
        config={modalConfig}
        isProcessing={isProcessing}
        onClose={() => !isProcessing && setModalConfig(null)}
        onConfirm={handleConfirmAction}
      />

      <ViewModal
        row={viewRow}
        onClose={() => setViewRow(null)}
      />
    </>
  );
}