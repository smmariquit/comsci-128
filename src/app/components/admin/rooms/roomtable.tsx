import { C } from "@/lib/palette";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type OccupancyStatus = "Empty" | "Partially Occupied" | "Fully Occupied" ;
export type RoomType = "Co-ed" | "Women Only" | "Men Only" 

export interface RoomRow {
  housing_id: number;
  room_id: number;
  room_code: string;
  housing_name: string;
  room_type: RoomType;
  maximum_occupants: number;
  current_occupants: number;
  occupancy_status: OccupancyStatus;
  assigned_tenants: { id: string; name: string }[];
}

// ── Occupancy badge ───────────────────────────────────────────────────────────

const OCCUPANCY_STYLE: Record<OccupancyStatus, { bg: string; dot: string; text: string }> = {
  "Empty":              { bg: "rgba(86,115,117,0.12)",  dot: C.teal,   text: C.teal },
  "Partially Occupied": { bg: "rgba(201,100,42,0.13)",  dot: C.orange, text: C.orange },
  "Fully Occupied":   { bg: "rgba(227,175,100,0.18)", dot: C.amber,  text: "#A07820" },
};

function OccupancyBadge({ status }: { status: OccupancyStatus }) {
  const s = OCCUPANCY_STYLE[status];
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      background: s.bg,
      color: s.text,
      fontSize: 11,
      fontWeight: 600,
      padding: "3px 8px",
      borderRadius: 20,
      whiteSpace: "nowrap",
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
}

// ── Room type tag ─────────────────────────────────────────────────────────────

const TYPE_STYLE: Record<RoomType, { bg: string; text: string }> = {
  "Co-ed":   { bg: "rgba(86,115,117,0.14)",  text: C.teal },
  "Women Only":   { bg: "rgba(227,175,100,0.18)", text: "#A07820" },
  "Men Only":     { bg: "rgba(201,100,42,0.13)",  text: C.orange },
};

function RoomTypeTag({ type }: { type: RoomType }) {
  const s = TYPE_STYLE[type] ?? TYPE_STYLE["Co-ed"];
  return (
    <span style={{
      background: s.bg,
      color: s.text,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 6px",
      borderRadius: 6,
      whiteSpace: "nowrap",
    }}>
      {type}
    </span>
  );
}

// ── Action button ─────────────────────────────────────────────────────────────

type BtnVariant = "ghost" | "primary" | "danger" | "warn";

const BTN_STYLE: Record<BtnVariant, React.CSSProperties> = {
  ghost:   { background: "#fff", color: C.navy, border: `1px solid ${C.cream}` },
  primary: { background: C.orange, color: "#fff", border: "none" },
  danger:  { background: "rgba(201,100,42,0.10)", color: C.orange, border: `1px solid rgba(201,100,42,0.2)` },
  warn:    { background: "rgba(227,175,100,0.15)", color: "#A07820", border: `1px solid rgba(227,175,100,0.3)` },
};

function ActionBtn({ label, onClick, variant = "ghost", disabled }: {
  label: string;
  onClick: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        ...BTN_STYLE[variant],
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transform: hovered && !disabled ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered && !disabled ? "0 6px 14px rgba(28,38,50,0.08)" : "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

// ── Columns ───────────────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "room",      label: "Room" },
  { key: "property",  label: "Property" },
  { key: "type",      label: "Type" },
  { key: "bedspaces", label: "Bed Spaces" },
  { key: "occupancy", label: "Occupancy Status" },
  { key: "tenants",   label: "Tenants" },
  { key: "actions",   label: "Actions" },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  data: RoomRow[];
  onView: (row: RoomRow) => void;
  onEdit: (row: RoomRow) => void;
  onDelete: (row: RoomRow) => void;
  onOverrideAssign: (row: RoomRow) => void;
  onToggleOccupancy: (row: RoomRow) => void;
}

// ── Table ─────────────────────────────────────────────────────────────────────

export default function RoomTable({
  data,
  onView,
  onEdit,
  onDelete,
  onOverrideAssign,
  onToggleOccupancy,
}: Props) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      outline: `1px solid ${C.cream}`,
      overflow: "hidden",
    }}>

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 18px",
        borderBottom: `1px solid ${C.dividerLight}`,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
            Rooms
          </div>
          <div style={{ fontSize: 11, color: C.teal }}>
            {data.length} total
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.cream }}>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: "8px 14px",
                    textAlign: "left",
                    fontSize: 10,
                    color: C.teal,
                    textTransform: "uppercase",
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} style={{ padding: "32px 14px", textAlign: "center", color: C.teal, opacity: 0.55, fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>
                  No rooms found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
              const isOccupied = row.occupancy_status === "Fully Occupied";

              return (
                <tr
                  key={row.room_id}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`,
                    background: hoveredRow === i ? "rgba(28,38,50,0.03)" : "transparent",
                    transition: "background 0.15s ease",
                  }}
                >
                  <td style={{ padding: "8px 14px", fontFamily: "monospace", color: C.navy, fontWeight: 500 }}>
                    {row.room_code}
                  </td>

                  <td style={{ padding: "8px 14px", color: C.navy, fontWeight: 500 }}>
                    {row.housing_name}
                  </td>

                  <td style={{ padding: "8px 14px" }}>
                    <RoomTypeTag type={row.room_type} />
                  </td>

                  {/* Simplified Bedspaces */}
                  <td style={{ padding: "8px 14px", fontFamily: "monospace", color: C.teal }}>
                    {row.current_occupants} / {row.maximum_occupants}
                  </td>

                  <td style={{ padding: "8px 14px" }}>
                    <OccupancyBadge status={row.occupancy_status} />
                  </td>

                  <td style={{ padding: "8px 14px", color: C.teal }}>
                    {row.assigned_tenants.length === 0 ? (
                      <span style={{ color: C.teal, opacity: 0.6 }}>Unassigned</span>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {row.assigned_tenants.map((t) => (
                          <span key={t.id} style={{ fontSize: 11, fontWeight: 500, color: C.navy }}>
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  <td style={{ padding: "8px 14px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <ActionBtn label="View" onClick={() => onView(row)} />
                      <ActionBtn label="Edit" onClick={() => onEdit(row)} />
                      <ActionBtn
                        label="Assign"
                        onClick={() => onOverrideAssign(row)}
                        variant="primary"
                      />
                      <ActionBtn
                        label="Delete"
                        onClick={() => onDelete(row)}
                        variant="danger"
                        disabled={isOccupied}
                      />
                    </div>
                  </td>
                </tr>
              );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}