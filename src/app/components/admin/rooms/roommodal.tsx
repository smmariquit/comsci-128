"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { C } from "@/lib/palette";
import type { RoomRow, RoomType, OccupancyStatus } from "./roomtable";
import { X } from "lucide-react";

// ── Shared primitives ─────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 10.5, fontFamily: "'DM Mono', monospace", fontWeight: 500,
  color: C.teal, textTransform: "uppercase", letterSpacing: 0.8,
  display: "block", marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%", fontFamily: "'DM Sans', sans-serif", fontSize: 13,
  color: C.navy, background: "#fff", border: `1px solid ${C.cream}`,
  borderRadius: 8, padding: "9px 12px", outline: "none", boxSizing: "border-box",
};
const selectStyle: React.CSSProperties = {
  ...inputStyle, cursor: "pointer", appearance: "none" as const,
};

function Backdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(28,38,50,0.45)",
        zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ModalShell({
  title, sub, onClose, children, footer,
}: {
  title: string; sub?: string; onClose: () => void;
  children: React.ReactNode; footer: React.ReactNode;
}) {
  const [closeHovered, setCloseHovered] = useState(false);

  return (
    <div style={{
      background: "#fff", borderRadius: 16, width: 500, maxWidth: "92vw",
      outline: `1px solid ${C.cream}`, fontFamily: "'DM Sans', sans-serif", overflow: "hidden",
    }}>
      <div style={{
        padding: "20px 24px 16px", borderBottom: `1px solid ${C.dividerLight}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{title}</div>
          {sub && (
            <div style={{ fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
              {sub}
            </div>
          )}
        </div>
        {/* ✅ aria-label gives the icon-only button a discernible name */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          onMouseEnter={() => setCloseHovered(true)}
          onMouseLeave={() => setCloseHovered(false)}
          style={{
            background: C.cream, border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            transform: closeHovered ? "translateY(-1px)" : "translateY(0)",
            boxShadow: closeHovered ? "0 6px 14px rgba(28,38,50,0.08)" : "none",
            transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
          }}
        >
          <X size={14} color={C.teal} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
      <div style={{
        padding: "16px 24px", borderTop: `1px solid ${C.dividerLight}`,
        display: "flex", justifyContent: "flex-end", gap: 10,
      }}>
        {footer}
      </div>
    </div>
  );
}

function CancelBtn({ onClose, disabled }: { onClose: () => void; disabled?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        padding: "9px 20px", borderRadius: 9, border: `1px solid ${C.cream}`,
        background: "#fff", color: C.navy, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered ? "0 6px 14px rgba(28,38,50,0.08)" : "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      Cancel
    </button>
  );
}

function PrimaryBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
        padding: "9px 20px", borderRadius: 9, border: "none",
        background: C.orange, color: "#fff", cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.65 : 1,
        transform: hovered ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered ? "0 8px 18px rgba(201,100,42,0.18)" : "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 0", borderBottom: `1px solid ${C.dividerLight}`,
    }}>
      <span style={{
        fontSize: 10.5, fontFamily: "'DM Mono', monospace", fontWeight: 500,
        color: C.teal, textTransform: "uppercase", letterSpacing: 0.8,
      }}>
        {label}
      </span>
      <span style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: C.navy }}>
        {value}
      </span>
    </div>
  );
}

// ── 1. View Room Modal ────────────────────────────────────────────────────────

export function ViewRoomModal({ room, onClose }: { room: RoomRow; onClose: () => void }) {
  const [closeHovered, setCloseHovered] = useState(false);

  return (
    <Backdrop onClose={onClose}>
      <div style={{
        background: "#fff", borderRadius: 16, width: 460, maxWidth: "92vw",
        outline: `1px solid ${C.cream}`, overflow: "hidden",
      }}>
        {/* Dark header */}
        <div style={{
          padding: "20px 24px 16px", background: C.navy,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.cream }}>{room.room_code}</div>
            <div style={{ fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
              Room Details
            </div>
          </div>
          {/* ✅ aria-label on icon-only button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            onMouseEnter={() => setCloseHovered(true)}
            onMouseLeave={() => setCloseHovered(false)}
            style={{
              background: "rgba(237,233,222,0.12)", border: "none", borderRadius: 8,
              width: 30, height: 30, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: closeHovered ? "translateY(-1px)" : "translateY(0)",
              boxShadow: closeHovered ? "0 6px 14px rgba(28,38,50,0.08)" : "none",
              transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
            }}
          >
            <X size={14} color={C.cream} strokeWidth={2.5} aria-hidden="true" />
          </button>
        </div>

        <div style={{ padding: "4px 24px 8px" }}>
          <DetailRow label="Property"         value={room.housing_name} />
          <DetailRow label="Room Type"        value={room.room_type} />
          <DetailRow label="Bed Spaces"       value={`${room.current_occupants} / ${room.maximum_occupants}`} />
          <DetailRow label="Occupancy"        value={room.occupancy_status} />
          <DetailRow
            label="Assigned Tenants"
            value={
              room.assigned_tenants.length === 0
                ? <span style={{ color: C.teal, opacity: 0.6, fontStyle: "italic" }}>None</span>
                : room.assigned_tenants.map(t => t.name).join(", ")
            }
          />
        </div>

        <div style={{
          padding: "16px 24px", borderTop: `1px solid ${C.dividerLight}`,
          display: "flex", justifyContent: "flex-end",
        }}>
          <PrimaryBtn label="Close" onClick={onClose} />
        </div>
      </div>
    </Backdrop>
  );
}

// ── 2. Add / Edit Room Modal ──────────────────────────────────────────────────

export interface RoomForm {
  housing_name:      string;
  room_type:         RoomType;
  maximum_occupants: string;
  occupancy_status:  OccupancyStatus;
}

interface RoomFormModalProps {
  initial?:       Partial<RoomForm>;
  housingOptions: string[];
  onClose:        () => void;
  onSubmit:       (form: RoomForm) => void;
  mode:           "add" | "edit";
  isSubmitting?:  boolean;
}

export function RoomFormModal({ initial, housingOptions, onClose, onSubmit, mode, isSubmitting = false }: RoomFormModalProps) {
  const [form, setForm] = useState<RoomForm>({
    housing_name:      initial?.housing_name      ?? "",
    room_type:         initial?.room_type          ?? "Co-ed",
    maximum_occupants: initial?.maximum_occupants  ?? "1",
    occupancy_status:  initial?.occupancy_status   ?? "Empty",
  });

  // ✅ Field now passes htmlFor so <label> is programmatically linked to its control
  const Field = ({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) => (
    <div style={{ flex: 1 }}>
      <label htmlFor={htmlFor} style={labelStyle}>{label}</label>
      {children}
    </div>
  );

  return (
    <Backdrop onClose={onClose}>
      <ModalShell
        title={mode === "add" ? "Add New Room" : "Edit Room"}
        sub={mode === "add" ? "Fill in room details" : "Update room information"}
        onClose={onClose}
        footer={
          <>
            <CancelBtn onClose={onClose} disabled={isSubmitting} />
            <PrimaryBtn
              label={
                isSubmitting
                  ? mode === "add" ? "Adding..." : "Saving..."
                  : mode === "add" ? "Add Room" : "Save Changes"
              }
              onClick={() => onSubmit(form)}
              disabled={isSubmitting}
            />
          </>
        }
      >
        {/* Property — ✅ label linked via htmlFor/id */}
        <div>
          <label htmlFor="rm-property" style={labelStyle}>Property</label>
          <select
            id="rm-property"
            value={form.housing_name}
            onChange={(e) => setForm({ ...form, housing_name: e.target.value })}
            style={selectStyle}
          >
            <option value="">Select property...</option>
            {housingOptions.map((h) => (
              <option key={h} value={h}>{h}</option>
            ))}
          </select>
        </div>

        {/* Row: Type + Max occupants */}
        <div style={{ display: "flex", gap: 12 }}>
          <Field label="Room Type" htmlFor="rm-type">
            <select aria-label="Room Type"
              id="rm-type"
              value={form.room_type}
              onChange={(e) => setForm({ ...form, room_type: e.target.value as RoomType })}
              style={selectStyle}
            >
              {(["Co-ed", "Women Only", "Men Only"] as RoomType[]).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Max Occupants" htmlFor="rm-max">
            <input aria-label="Maximum Occupants"
              id="rm-max"
              type="number"
              min={1}
              value={form.maximum_occupants}
              onChange={(e) => setForm({ ...form, maximum_occupants: e.target.value })}
              style={inputStyle}
            />
          </Field>
        </div>
        

        {mode === "add" && (
          <div style={{
            background: C.cream, borderRadius: 8, padding: "10px 14px",
            fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace",
          }}>
            Room ID will be auto-generated upon creation.
          </div>
        )}
      </ModalShell>
    </Backdrop>
  );
}

// ── 3. Override Assignment Modal ──────────────────────────────────────────────

export function OverrideAssignModal({
  room, onClose, onAssign, onUnassign, onFetchEligibleStudents, isSubmitting = false,
}: {
  room:       RoomRow;
  onClose:    () => void;
  onAssign:   (studentId: string) => void;
  onFetchEligibleStudents: () => Promise<{ id: any; name: string }[]>
  onUnassign: (studentId: string) => void;
  isSubmitting?: boolean;
}) {
  const [selectedId, setSelectedId] = useState(""); // Track dropdown selection
  const [students, setStudents] = useState<{ id: any; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  // const [name,   setName]   = useState("");
  // const [number, setNumber] = useState("");
  // const isOccupied = room.occupancy_status === "Fully Occupied";
  const isFull = room.current_occupants >= room.maximum_occupants;
  const hasTenants = room.assigned_tenants.length > 0;
  const [removeHover, setRemoveHover] = useState<string | null>(null);

  useEffect(() => {
    onFetchEligibleStudents()
      .then(setStudents)
      .finally(() => setLoading(false));
  }, [onFetchEligibleStudents]);

  return (
    <Backdrop onClose={onClose}>
      <ModalShell
        title="Assign Tenant"
        sub={`${room.room_code} · ${room.housing_name}`}
        onClose={onClose}
        footer={
          <>
            <CancelBtn onClose={onClose} disabled={isSubmitting} />
            {!isFull && (
              <PrimaryBtn
                label={isSubmitting ? "Assigning..." : loading ? "Loading..." : "Assign Tenant"}
                onClick={() => { if (selectedId) onAssign(selectedId); }}
                disabled={loading || isSubmitting || !selectedId}
              />
            )}
          </>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          
          {/* Section: Currently Assigned Tenants (Keep as is) */}
          {hasTenants && (
             <div style={{ background: C.cream, borderRadius: 8, padding: "12px 14px" }}>
               <div style={{ fontSize: 10.5, color: C.teal, fontFamily: "'DM Mono', monospace", marginBottom: 8, textTransform: "uppercase" }}>
                 Currently Assigned
               </div>
               <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                 {room.assigned_tenants.map((t) => (
                    <div key={t.id} style={{ display: "flex", justifyContent: "space-between", background: "#fff", padding: "8px 12px", borderRadius: 6, border: `1px solid ${C.dividerLight}` }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{t.name}</span>
                      <button
                        onClick={() => onUnassign(t.id)}
                        disabled={isSubmitting}
                        onMouseEnter={() => setRemoveHover(t.id)}
                        onMouseLeave={() => setRemoveHover((current) => (current === t.id ? null : current))}
                        style={{
                          border: "none",
                          background: "none",
                          color: C.orange,
                          fontSize: 11,
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          opacity: isSubmitting ? 0.55 : 1,
                          fontWeight: 600,
                          transform: removeHover === t.id ? "translateY(-1px)" : "translateY(0)",
                          textDecoration: removeHover === t.id ? "underline" : "none",
                          transition: "transform 0.15s ease, text-decoration 0.15s ease",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                 ))}
               </div>
             </div>
          )}

          {/* Section: NEW Smart Dropdown */}
          {!isFull ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <label htmlFor="student-select" style={labelStyle}>Eligible Students</label>
                <select
                  id="student-select"
                  style={selectStyle}
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  disabled={loading || isSubmitting}
                >
                  <option value="">
                    {loading ? "Fetching eligible students..." : "Select a student..."}
                  </option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {students.length === 0 && !loading && (
                   <p style={{ fontSize: 11, color: C.orange, marginTop: 4 }}>
                     No unassigned {room.room_type === "Co-ed" ? "" : room.room_type.replace(" Only", "")} students found with approved applications.
                   </p>
                )}
              </div>

              <div style={{ background: C.cream, borderRadius: 8, padding: "10px 14px", fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace" }}>
                Only students with <strong style={{ color: C.navy }}>Approved</strong> applications matching the room type are shown.
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(201,100,42,0.08)", borderRadius: 8, padding: "12px 14px", fontSize: 11, color: C.orange, textAlign: "center" }}>
              Room is full! ({room.current_occupants}/{room.maximum_occupants}) 
            </div>
          )}
        </div>
      </ModalShell>
    </Backdrop>
  );
}

