"use client";

import { useState } from "react";
import { C } from "@/lib/palette";
import type { RoomRow, RoomType, OccupancyStatus } from "./roomtable";

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
          style={{
            background: C.cream, border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {/* ✅ aria-hidden hides decorative SVG from screen readers */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
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

function CancelBtn({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        padding: "9px 20px", borderRadius: 9, border: `1px solid ${C.cream}`,
        background: "#fff", color: C.navy, cursor: "pointer",
      }}
    >
      Cancel
    </button>
  );
}

function PrimaryBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
        padding: "9px 20px", borderRadius: 9, border: "none",
        background: C.orange, color: "#fff", cursor: "pointer",
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
            style={{
              background: "rgba(237,233,222,0.12)", border: "none", borderRadius: 8,
              width: 30, height: 30, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.cream} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
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
                : room.assigned_tenants.join(", ")
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
}

export function RoomFormModal({ initial, housingOptions, onClose, onSubmit, mode }: RoomFormModalProps) {
  const [form, setForm] = useState<RoomForm>({
    housing_name:      initial?.housing_name      ?? "",
    room_type:         initial?.room_type          ?? "Single",
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
            <CancelBtn onClose={onClose} />
            <PrimaryBtn
              label={mode === "add" ? "Add Room" : "Save Changes"}
              onClick={() => onSubmit(form)}
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
              {(["Single", "Double", "Suite", "Bedspace"] as RoomType[]).map((t) => (
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

        {/* Row: Occupancy + Payment */}
        <div style={{ display: "flex", gap: 12 }}>
          <Field label="Occupancy Status" htmlFor="rm-occupancy">
            <select aria-label="Occupany Status"
              id="rm-occupancy"
              value={form.occupancy_status}
              onChange={(e) => setForm({ ...form, occupancy_status: e.target.value as OccupancyStatus })}
              style={selectStyle}
            >
              {(["Empty", "Occupied", "Reserved", "Under Maintenance"] as OccupancyStatus[]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
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
  room, onClose, onAssign, onUnassign,
}: {
  room:       RoomRow;
  onClose:    () => void;
  onAssign:   (studentName: string, studentNumber: string) => void;
  onUnassign: () => void;
}) {
  const [name,   setName]   = useState("");
  const [number, setNumber] = useState("");
  const isOccupied = room.occupancy_status === "Occupied";

  return (
    <Backdrop onClose={onClose}>
      <ModalShell
        title="Override Assignment"
        sub={`${room.room_code} · ${room.housing_name}`}
        onClose={onClose}
        footer={
          <>
            <CancelBtn onClose={onClose} />
            {isOccupied ? (
              <button
                onClick={onUnassign}
                style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
                  padding: "9px 20px", borderRadius: 9, border: "none",
                  background: "rgba(201,100,42,0.15)", color: C.orange, cursor: "pointer",
                }}
              >
                Unassign Tenant
              </button>
            ) : (
              <PrimaryBtn
                label="Assign Tenant"
                onClick={() => { if (name) onAssign(name, number); }}
              />
            )}
          </>
        }
      >
        {isOccupied ? (
          <>
            <div style={{ background: C.cream, borderRadius: 8, padding: "12px 14px" }}>
              <div style={{
                fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace",
                marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.8,
              }}>
                Currently Assigned
              </div>
              {room.assigned_tenants.map((t) => (
                <div key={t} style={{ fontSize: 13, fontWeight: 500, color: C.navy }}>{t}</div>
              ))}
            </div>
            <div style={{
              background: "rgba(201,100,42,0.08)", borderRadius: 8, padding: "10px 14px",
              fontSize: 11, color: C.orange, fontFamily: "'DM Mono', monospace",
            }}>
              ⚠ Unassigning will update the student's housing status and log this action in the audit trail.
            </div>
          </>
        ) : (
          <>
            {/* ✅ label + id pairs for both inputs */}
            <div>
              <label htmlFor="assign-name" style={labelStyle}>Student Name</label>
              <input
                id="assign-name"
                style={inputStyle}
                placeholder="e.g. Santos, Maria"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="assign-number" style={labelStyle}>Student Number</label>
              <input
                id="assign-number"
                style={inputStyle}
                placeholder="e.g. 2021-00123"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
            </div>
            <div style={{
              background: C.cream, borderRadius: 8, padding: "10px 14px",
              fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace",
            }}>
              This will update the student's <strong style={{ color: C.navy }}>housing_status</strong> and log the override in the audit trail.
            </div>
          </>
        )}
      </ModalShell>
    </Backdrop>
  );
}

