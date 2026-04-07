"use client";

import { useState } from "react";
import { C } from "@/lib/palette";
import type { BillType } from "./billingtable";
import { MOCK_USERS } from "@/app/components/admin/user/usertable";

// ── Types ─────────────────────────────────────────────────────────────────────

type IssueMode = "single" | "bulk";

export interface IssueBillPayload {
  mode:                   IssueMode;
  student_account_number?: number;  // single mode
  housing_name:           string;   // bulk uses this to target all students
  bill_type:              BillType;
  amount:                 number;
  due_date:               string;
}

interface Props {
  open:           boolean;
  housingOptions: string[];
  onClose:        () => void;
  onSubmit:       (payload: IssueBillPayload) => void;
}

// ── Styles ────────────────────────────────────────────────────────────────────

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
  width: "100%",
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

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function IssueBillModal({ open, housingOptions, onClose, onSubmit }: Props) {
  const [mode, setMode]           = useState<IssueMode>("single");
  const [housing, setHousing]     = useState(housingOptions[0] ?? "");
  const [studentId, setStudentId] = useState<number | "">("");
  const [billType, setBillType]   = useState<BillType>("Rent");
  const [amount, setAmount]       = useState<number | "">("");
  const [dueDate, setDueDate]     = useState("");
  const [error, setError]         = useState("");

  if (!open) return null;

  // Students from the selected property (from mock)
  const eligibleStudents = MOCK_USERS.filter(
    (u) => u.user_type === "Student" && u.housing_name === housing && !u.is_deleted
  );

  function handleSubmit() {
    setError("");

    if (!housing)  return setError("Please select a property.");
    if (!billType) return setError("Please select a bill type.");
    if (!amount || Number(amount) <= 0) return setError("Please enter a valid amount.");
    if (!dueDate)  return setError("Please select a due date.");
    if (mode === "single" && !studentId) return setError("Please select a student.");

    onSubmit({
      mode,
      housing_name: housing,
      student_account_number: mode === "single" ? Number(studentId) : undefined,
      bill_type: billType,
      amount: Number(amount),
      due_date: dueDate,
    });

    // Reset
    setMode("single");
    setStudentId("");
    setBillType("Rent");
    setAmount("");
    setDueDate("");
    setError("");
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(28,38,50,0.35)",
          backdropFilter: "blur(2px)",
          zIndex: 50,
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        borderRadius: 14,
        boxShadow: "0 8px 40px rgba(28,38,50,0.18)",
        width: "100%",
        maxWidth: 480,
        zIndex: 51,
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
      }}>

        {/* Modal header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${C.dividerLight}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>Issue Bill</div>
            <div style={{ fontSize: 11, color: C.teal, marginTop: 2 }}>
              Generate a new billing statement
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: C.teal, fontSize: 18, lineHeight: 1, padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Mode toggle */}
          <div style={fieldStyle}>
            <span style={labelStyle}>Issue To</span>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: C.cream,
              borderRadius: 8,
              padding: 3,
              gap: 3,
            }}>
              {(["single", "bulk"] as IssueMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setStudentId(""); }}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "7px 0",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    background: mode === m ? "#fff" : "transparent",
                    color: mode === m ? C.navy : C.teal,
                    boxShadow: mode === m ? "0 1px 4px rgba(28,38,50,0.10)" : "none",
                    transition: "all 0.15s",
                  }}
                >
                  {m === "single" ? "Single Student" : "All Students (Bulk)"}
                </button>
              ))}
            </div>
          </div>

          {/* Property */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Property</label>
            <div style={{ position: "relative" }}>
              <select
                value={housing}
                onChange={(e) => { setHousing(e.target.value); setStudentId(""); }}
                style={selectBase}
              >
                {housingOptions.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          {/* Student selector — single mode only */}
          {mode === "single" && (
            <div style={fieldStyle}>
              <label style={labelStyle}>Student</label>
              <div style={{ position: "relative" }}>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(Number(e.target.value))}
                  style={selectBase}
                >
                  <option value="">Select student…</option>
                  {eligibleStudents.map((u) => (
                    <option key={u.account_number} value={u.account_number}>
                      {u.full_name}
                    </option>
                  ))}
                </select>
              </div>
              {eligibleStudents.length === 0 && (
                <span style={{ fontSize: 10, color: C.orange, marginTop: 2 }}>
                  No active students found for this property.
                </span>
              )}
            </div>
          )}

          {/* Bulk note */}
          {mode === "bulk" && (
            <div style={{
              background: "rgba(227,175,100,0.13)",
              border: `1px solid rgba(227,175,100,0.3)`,
              borderRadius: 8,
              padding: "10px 12px",
              fontSize: 11,
              color: "#A07820",
              lineHeight: 1.5,
            }}>
              <strong>Bulk issue:</strong> This bill will be issued to all{" "}
              <strong>{eligibleStudents.length}</strong> active student(s) under{" "}
              <strong>{housing}</strong>.
            </div>
          )}

          {/* Bill type + Amount row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Bill Type</label>
              <div style={{ position: "relative" }}>
                <select
                  value={billType}
                  onChange={(e) => setBillType(e.target.value as BillType)}
                  style={selectBase}
                >
                  {(["Rent", "Utility", "Maintenance", "Miscellaneous"] as BillType[]).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Amount (₱)</label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 5500"
                value={amount}
                onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                style={inputBase}
              />
            </div>
          </div>

          {/* Due date */}
          <div style={fieldStyle}>
            <label style={labelStyle}>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={inputBase}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{
              fontSize: 11,
              color: C.orange,
              background: "rgba(201,100,42,0.08)",
              border: `1px solid rgba(201,100,42,0.2)`,
              borderRadius: 8,
              padding: "8px 12px",
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div style={{
          padding: "14px 20px",
          borderTop: `1px solid ${C.dividerLight}`,
          display: "flex",
          justifyContent: "flex-end",
          gap: 8,
        }}>
          <button
            onClick={onClose}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              background: "#fff",
              color: C.navy,
              border: `1px solid ${C.cream}`,
              borderRadius: 8,
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              background: C.orange,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "8px 20px",
              cursor: "pointer",
            }}
          >
            Issue Bill
          </button>
        </div>
      </div>
    </>
  );
}