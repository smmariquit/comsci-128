"use client";

import { useState, useEffect } from "react";
import { C } from "@/lib/palette";
import type { BillRow, PaymentStatus, BillType } from "./billingtable";

type ExtendedBillType = BillType | "Other";

// ── Design tokens ─────────────────────────────────────────────────────────────

const T = {
  navy:    C.navy,
  teal:    C.teal,
  orange:  C.orange,
  cream:   C.cream,
  divider: C.dividerLight,
  bg:      "#f5f3ef",
  bgInput: "#fff",
  readonly: "#f7f6f3",
  amber:   "#A07820",
  green:   "#2a7d4f",
};

// ── Shared style constants ────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontSize: 10.5,
  fontFamily: "'DM Sans', sans-serif",
  fontWeight: 600,
  color: T.teal,
  textTransform: "uppercase",
  letterSpacing: 0.7,
  display: "block",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "'DM Sans', sans-serif",
  fontSize: 13,
  color: T.navy,
  background: T.bgInput,
  border: "1px solid #e2ddd6",
  borderRadius: 8,
  padding: "9px 12px",
  outline: "none",
  boxSizing: "border-box",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "none" as const,
  paddingRight: 30,
};

const readonlyStyle: React.CSSProperties = {
  ...inputStyle,
  background: T.readonly,
  color: T.teal,
  cursor: "not-allowed",
};

// ── Exported types ────────────────────────────────────────────────────────────

export interface ChargeItem {
  id:     string;
  type:   BillType | "Other";
  amount: string;
}

/** Matches the `bill` schema: one row per charge item */
export interface IssueBillForm {
  student_name:           string;
  housing_name:           string;
  student_account_number: number | null; // null until Supabase join available
  room_code:              string;
  due_date:               string;   // "YYYY-MM-DD"
  issue_date:             string;   // auto-set to today
  charges:                ChargeItem[];
}

// ── Shared UI helpers ─────────────────────────────────────────────────────────

function CloseBtn({ onClose, light = false }: { onClose: () => void; light?: boolean }) {
  return (
    <button
      onClick={onClose}
      aria-label="Close modal"
      style={{
        background: light ? "rgba(255,255,255,0.12)" : T.bg,
        border: "none", borderRadius: 8,
        width: 30, height: 30, cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke={light ? "#f5f3ef" : T.teal} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6"  y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  );
}

function CancelBtn({ onClose }: { onClose: () => void }) {
  return (
    <button onClick={onClose} style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
      padding: "9px 20px", borderRadius: 9,
      border: "1px solid #e2ddd6", background: "#fff", color: T.navy, cursor: "pointer",
    }}>
      Cancel
    </button>
  );
}

function PrimaryBtn({ label, onClick, disabled = false }: {
  label: string; onClick: () => void; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
      padding: "9px 22px", borderRadius: 9, border: "none",
      background: disabled ? "#ccc" : T.orange,
      color: "#fff",
      cursor: disabled ? "not-allowed" : "pointer",
    }}>
      {label}
    </button>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "2px 0" }}>
      <span style={{
        fontSize: 10, fontWeight: 700, color: T.teal,
        textTransform: "uppercase", letterSpacing: 1,
        fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: "#ece8e0" }} />
    </div>
  );
}

function SelectField({ id, label, value, onChange, children, flex }: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; children: React.ReactNode; flex?: number;
}) {
  return (
    <div style={{ flex: flex ?? 1, display: "flex", flexDirection: "column" }}>
      <label htmlFor={id} style={labelStyle}>{label}</label>
      <div style={{ position: "relative" }}>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} style={selectStyle}>
          {children}
        </select>
        <svg style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke={T.teal} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IssueBillModal
// ─────────────────────────────────────────────────────────────────────────────

interface IssueBillModalProps {
  open:           boolean;
  housingOptions: string[];          // list of housing_name strings
  onClose:        () => void;
  onSubmit:       (form: IssueBillForm) => void;
}

export default function IssueBillModal({
  open, housingOptions, onClose, onSubmit,
}: IssueBillModalProps) {

  const today = new Date().toISOString().split("T")[0];

  // ── Form state ──────────────────────────────────────────────────────────────
  const [housingName,  setHousingName]  = useState("");
  const [studentName,  setStudentName]  = useState("");
  const [roomCode,     setRoomCode]     = useState("");
  const [dueDate,      setDueDate]      = useState("");
  const [charges, setCharges] = useState<ChargeItem[]>([
    { id: "1", type: "Rent",    amount: "" },
    { id: "2", type: "Utility", amount: "" },
  ]);

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setHousingName("");
      setStudentName("");
      setRoomCode("");
      setDueDate("");
      setCharges([
        { id: "1", type: "Rent",    amount: "" },
        { id: "2", type: "Utility", amount: "" },
      ]);
    }
  }, [open]);

  if (!open) return null;

  // ── Charge helpers ──────────────────────────────────────────────────────────
  function addCharge() {
    setCharges((p) => [...p, { id: String(Date.now()), type: "Other", amount: "" }]);
  }

  function removeCharge(id: string) {
    setCharges((p) => p.filter((c) => c.id !== id));
  }

  function updateCharge(id: string, field: "type" | "amount", value: string) {
    setCharges((p) => p.map((c) => c.id === id ? { ...c, [field]: value } : c));
  }

  const validCharges = charges.filter((c) => parseFloat(c.amount) > 0);
  const totalAmount  = charges.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
  const isValid      = !!housingName && !!studentName && !!dueDate && validCharges.length > 0;

  function handleSubmit() {
    if (!isValid) return;
    onSubmit({
      student_name:           studentName.trim(),
      housing_name:           housingName,
      student_account_number: null,          // resolved server-side / Supabase
      room_code:              roomCode.trim(),
      due_date:               dueDate,
      issue_date:             today,
      charges,
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(28,38,50,0.45)",
        zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          width: 640,
          maxWidth: "96vw",
          maxHeight: "94vh",
          border: "1px solid #e2ddd6",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'DM Sans', sans-serif",
          overflow: "hidden",
        }}
      >

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          padding: "20px 24px 18px",
          background: T.navy,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#f5f3ef", letterSpacing: -0.2 }}>
              Issue a Bill
            </div>
            <div style={{ fontSize: 11, color: "#7a9ea0", marginTop: 3 }}>
              Generate a new billing record for a tenant
            </div>
          </div>
          <CloseBtn onClose={onClose} light />
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "22px 24px",
          display: "flex", flexDirection: "column", gap: 18,
        }}>

          {/* Section 1 — Billing Target */}
          <SectionDivider label="Billing Target" />

          {/* Row: Housing + Due Date */}
          <div style={{ display: "flex", gap: 14 }}>
            <SelectField
              id="bill-housing" label="Property" flex={3}
              value={housingName} onChange={setHousingName}
            >
              <option value="">Select a property…</option>
              {housingOptions.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </SelectField>

            <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
              <label htmlFor="bill-due" style={labelStyle}>Due Date</label>
              <input
                id="bill-due"
                type="date"
                value={dueDate}
                min={today}
                onChange={(e) => setDueDate(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Row: Student name + Room code */}
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
              <label htmlFor="bill-student" style={labelStyle}>Student Name</label>
              <input
                id="bill-student"
                type="text"
                placeholder="e.g. Santos, Maria"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
              <label htmlFor="bill-room" style={labelStyle}>Room / Unit Code</label>
              <input
                id="bill-room"
                type="text"
                placeholder="e.g. RM-0041"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Issue date — read-only */}
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <label htmlFor="bill-issue" style={labelStyle}>Issue Date</label>
              <input
                id="bill-issue"
                readOnly
                value={today}
                style={readonlyStyle}
              />
              <span style={{ fontSize: 10.5, color: T.teal, marginTop: 5 }}>
                Auto-set to today
              </span>
            </div>
          </div>

          {/* Section 2 — Charges */}
          <SectionDivider label="Charges" />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {charges.map((charge, idx) => (
              <div key={charge.id} style={{
                display: "flex", gap: 10, alignItems: "center",
                background: T.bg,
                border: "1px solid #e8e4db",
                borderRadius: 10,
                padding: "11px 14px",
              }}>
                {/* Index */}
                <span style={{
                  fontSize: 11, fontWeight: 700, color: T.teal,
                  width: 18, flexShrink: 0, textAlign: "center",
                }}>
                  {idx + 1}
                </span>

                {/* Bill type select */}
                <div style={{ flex: 1, position: "relative" }}>
                  <label htmlFor={`c-type-${charge.id}`}
                    style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0 }}>
                    Charge Type
                  </label>
                  <select
                    id={`c-type-${charge.id}`}
                    value={charge.type}
                    onChange={(e) => updateCharge(charge.id, "type", e.target.value)}
                    style={{
                      ...selectStyle,
                      background: "transparent", border: "none",
                      padding: "0 20px 0 0",
                      fontWeight: 600, fontSize: 13, color: T.navy, width: "100%",
                    }}
                  >
                    {(["Rent", "Utility", "Other"] as BillType[]).map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <svg style={{ position: "absolute", right: 2, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                    width="9" height="9" viewBox="0 0 24 24" fill="none"
                    stroke={T.teal} strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>

                {/* Vertical divider */}
                <div style={{ width: 1, height: 20, background: "#e2ddd6", flexShrink: 0 }} />

                {/* Amount */}
                <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.teal }}>₱</span>
                  <label htmlFor={`c-amt-${charge.id}`}
                    style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0 }}>
                    Charge Amount
                  </label>
                  <input
                    id={`c-amt-${charge.id}`}
                    type="number"
                    min={0}
                    placeholder="0.00"
                    value={charge.amount}
                    onChange={(e) => updateCharge(charge.id, "amount", e.target.value)}
                    style={{
                      ...inputStyle,
                      width: 110,
                      background: "transparent", border: "none", padding: 0,
                      fontWeight: 700, fontSize: 14, textAlign: "right",
                      color: parseFloat(charge.amount) > 0 ? T.navy : "#aaa",
                    }}
                  />
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeCharge(charge.id)}
                  aria-label={`Remove ${charge.type} charge`}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 26, height: 26, borderRadius: 6,
                    color: "#bbb", flexShrink: 0, transition: "color 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.orange)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#bbb")}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4h6v2"/>
                  </svg>
                </button>
              </div>
            ))}

            {/* Add charge */}
            <button
              onClick={addCharge}
              style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
                padding: "10px 0", borderRadius: 10,
                border: "1.5px dashed #d4cfc6",
                background: "transparent", color: T.teal,
                cursor: "pointer", width: "100%",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background    = T.bg;
                e.currentTarget.style.borderColor   = T.teal;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background    = "transparent";
                e.currentTarget.style.borderColor   = "#d4cfc6";
              }}
            >
              + Add Charge
            </button>
          </div>

          {/* Section 3 — Summary */}
          <SectionDivider label="Summary" />

          <div style={{
            background: T.bg,
            border: "1px solid #e8e4db",
            borderRadius: 10,
            padding: "14px 16px",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {/* Per-charge lines */}
            {validCharges.map((c) => (
              <div key={c.id} style={{
                display: "flex", justifyContent: "space-between",
                fontSize: 12, color: T.teal,
              }}>
                <span>{c.type}</span>
                <span style={{ fontFamily: "'DM Mono', monospace" }}>
                  ₱{parseFloat(c.amount).toLocaleString("en-PH")}
                </span>
              </div>
            ))}

            {validCharges.length > 0 && (
              <div style={{ height: 1, background: "#e2ddd6", margin: "2px 0" }} />
            )}

            {/* Grand total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{
                fontSize: 12, fontWeight: 700, color: T.navy,
                textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                Total Amount
              </span>
              <span style={{
                fontSize: 18, fontWeight: 800,
                color: totalAmount > 0 ? T.navy : "#bbb",
                fontFamily: "'DM Mono', monospace",
              }}>
                ₱{totalAmount.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Validation hint */}
            {!isValid && (
              <div style={{
                fontSize: 11, color: T.orange,
                display: "flex", alignItems: "center", gap: 5, marginTop: 2,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {!housingName ? "Select a property to continue"
                  : !studentName ? "Enter the student name"
                  : !dueDate ? "Set a due date"
                  : "Add at least one charge with an amount"}
              </div>
            )}
          </div>

        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div style={{
          padding: "16px 24px",
          borderTop: "1px solid #f0ece4",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0, background: "#faf9f7",
        }}>
          <span style={{ fontSize: 11, color: T.teal }}>
            {validCharges.length > 0
              ? `${validCharges.length} bill${validCharges.length > 1 ? "s" : ""} will be created`
              : "No charges added yet"}
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            <CancelBtn onClose={onClose} />
            <PrimaryBtn label="Issue Bill ✓" disabled={!isValid} onClick={handleSubmit} />
          </div>
        </div>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ViewBillModal (unchanged — kept here for co-location)
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<PaymentStatus, { text: string; bg: string; dot: string }> = {
  Paid:    { text: "#2a7d4f", bg: "rgba(42,125,79,0.10)",   dot: "#2a7d4f"  },
  Pending: { text: "#A07820", bg: "rgba(227,175,100,0.18)", dot: "#c8960a"  },
  Overdue: { text: C.orange,  bg: "rgba(201,100,42,0.13)",  dot: C.orange   },
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "10px 0", borderBottom: "1px solid #f0ece4",
    }}>
      <span style={{
        fontSize: 10.5, fontWeight: 600, color: T.teal,
        textTransform: "uppercase", letterSpacing: 0.7,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 500, color: T.navy, fontFamily: "'DM Sans', sans-serif" }}>
        {value}
      </span>
    </div>
  );
}

export function ViewBillModal({ bill, onClose }: { bill: BillRow; onClose: () => void }) {
  const fmtDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" }) : "—";

  const s = STATUS_COLOR[bill.status];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(28,38,50,0.45)",
        zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 16, width: 460, maxWidth: "92vw",
          border: "1px solid #e2ddd6", overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* Dark header */}
        <div style={{
          padding: "20px 24px 18px", background: T.navy,
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#f5f3ef" }}>
              #{String(bill.transaction_id).padStart(6, "0")}
            </div>
            <div style={{ fontSize: 11, color: "#7a9ea0", marginTop: 3 }}>Bill Details</div>
          </div>
          <button onClick={onClose} aria-label="Close modal" style={{
            background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="#f5f3ef" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6"  y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Status strip */}
        <div style={{
          padding: "10px 24px",
          background: s.bg,
          borderBottom: "1px solid #f0ece4",
          display: "flex", alignItems: "center", gap: 7,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: s.dot }} />
          <span style={{
            fontSize: 12, fontWeight: 700, color: s.text,
            textTransform: "uppercase", letterSpacing: 0.6,
          }}>
            {bill.status}
          </span>
        </div>

        {/* Detail rows */}
        <div style={{ padding: "4px 24px 10px" }}>
          <DetailRow label="Student"   value={bill.student_name} />
          <DetailRow label="Property"  value={bill.housing_name} />
          <DetailRow label="Bill Type" value={bill.bill_type} />
          <DetailRow label="Amount"    value={
            <strong style={{ fontSize: 15, color: T.navy }}>
              ₱{bill.amount.toLocaleString("en-PH")}
            </strong>
          } />
          <DetailRow label="Due Date"  value={fmtDate(bill.due_date)} />
          <DetailRow label="Date Paid" value={fmtDate(bill.date_paid)} />
        </div>

        <div style={{
          padding: "14px 24px", borderTop: "1px solid #f0ece4",
          display: "flex", justifyContent: "flex-end",
        }}>
          <button onClick={onClose} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            padding: "9px 22px", borderRadius: 9, border: "none",
            background: T.orange, color: "#fff", cursor: "pointer",
          }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}