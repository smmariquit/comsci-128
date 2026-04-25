"use client";

import { C } from "@/lib/palette";
import { useState } from "react";
import {
  OccupancyBadge, RoomTypeTag, ApplicationStatusBadge,
  PaymentStatusBadge, BillTypeTag,
} from "./reportsui";
import { formatDate, formatPeso } from "@/app/components/admin/reports/reportsmock";
import type {
  OccupancyReportRow, ApplicationReportRow,
  RevenueReportRow, AccommodationHistoryRow,
} from "./reportsmock";
import type { ReportType } from "@/app/components/admin/reports/reports_wrapper";

// ── Union type for any drillable row ─────────────────────────────────────────

export type DetailRow =
  | { kind: "occupancy";     data: OccupancyReportRow }
  | { kind: "application";   data: ApplicationReportRow }
  | { kind: "revenue";       data: RevenueReportRow }
  | { kind: "accommodation"; data: AccommodationHistoryRow };

// ── Field row helper ──────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span style={{
        fontSize: 10, fontWeight: 600, color: C.teal,
        textTransform: "uppercase", letterSpacing: "0.05em",
        fontFamily: "'DM Mono', monospace",
      }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: C.navy, fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>
        {children}
      </span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.dividerLight, margin: "4px 0" }} />;
}

// ── Per-type detail bodies ────────────────────────────────────────────────────

function OccupancyDetail({ data }: { data: OccupancyReportRow }) {
  const rate = data.maximum_occupants > 0
    ? Math.round(((data.maximum_occupants - data.current_occupants) / data.maximum_occupants) * 100)
    : 0;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Field label="Room Code"><span style={{ fontFamily: "monospace" }}>{data.room_code}</span></Field>
      <Field label="Property">{data.housing_name}</Field>
      <Field label="Room Type"><RoomTypeTag type={data.room_type} /></Field>
      <Field label="Status"><OccupancyBadge status={data.occupancy_status} /></Field>
      <Field label="Current Occupants"><span style={{ fontFamily: "monospace" }}>{data.current_occupants}</span></Field>
      <Field label="Max Occupants"><span style={{ fontFamily: "monospace" }}>{data.maximum_occupants}</span></Field>
      <Field label="Vacancy Rate">
        <span style={{ fontFamily: "monospace", color: rate > 50 ? C.orange : C.teal, fontWeight: 700 }}>
          {rate}%
        </span>
      </Field>
    </div>
  );
}

function ApplicationDetail({ data }: { data: ApplicationReportRow }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Field label="Application ID"><span style={{ fontFamily: "monospace" }}>#{data.application_id}</span></Field>
      <Field label="Status"><ApplicationStatusBadge status={data.application_status} /></Field>
      <Field label="Student">{data.student_name}</Field>
      <Field label="Student No."><span style={{ fontFamily: "monospace" }}>{data.student_number}</span></Field>
      <Field label="Property">{data.housing_name}</Field>
      <Field label="Preferred Room"><RoomTypeTag type={data.preferred_room_type} /></Field>
      <Field label="Expected Move-out">{formatDate(data.expected_moveout_date)}</Field>
      <Field label="Actual Move-out">
        {data.actual_moveout_date
          ? <span style={{ color: C.orange, fontWeight: 600 }}>{formatDate(data.actual_moveout_date)}</span>
          : <span style={{ color: C.teal, opacity: 0.45 }}>Not yet</span>}
      </Field>
    </div>
  );
}

function RevenueDetail({ data }: { data: RevenueReportRow }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Field label="Transaction ID"><span style={{ fontFamily: "monospace" }}>#{data.transaction_id}</span></Field>
      <Field label="Status"><PaymentStatusBadge status={data.status} /></Field>
      <Field label="Student">{data.student_name}</Field>
      <Field label="Property">{data.housing_name}</Field>
      <Field label="Bill Type"><BillTypeTag type={data.bill_type} /></Field>
      <Field label="Amount">
        <span style={{ fontFamily: "monospace", fontSize: 15, fontWeight: 700, color: C.navy }}>
          {formatPeso(data.amount)}
        </span>
      </Field>
      <Field label="Issue Date">{formatDate(data.issue_date)}</Field>
      <Field label="Due Date">
        <span style={{ color: data.status === "Overdue" ? C.orange : C.navy, fontWeight: data.status === "Overdue" ? 700 : 500 }}>
          {formatDate(data.due_date)}
        </span>
      </Field>
      <Field label="Date Paid">
        {data.date_paid
          ? <span style={{ color: C.teal }}>{formatDate(data.date_paid)}</span>
          : <span style={{ color: C.teal, opacity: 0.45 }}>Unpaid</span>}
      </Field>
    </div>
  );
}

function AccommodationDetail({ data }: { data: AccommodationHistoryRow }) {
  const days = Math.round(
    (new Date(data.moveout_date).getTime() - new Date(data.movein_date).getTime())
    / (1000 * 60 * 60 * 24)
  );
  const months = Math.round(days / 30);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Field label="Student">{data.student_name}</Field>
      <Field label="Student No."><span style={{ fontFamily: "monospace" }}>{data.student_number}</span></Field>
      <Field label="Room Code"><span style={{ fontFamily: "monospace" }}>{data.room_code}</span></Field>
      <Field label="Property">{data.housing_name}</Field>
      <Field label="Room Type"><RoomTypeTag type={data.room_type} /></Field>
      <Field label="Duration">
        <span style={{ fontFamily: "monospace", color: C.teal, fontWeight: 600 }}>~{months} months</span>
      </Field>
      <Field label="Move-in Date">{formatDate(data.movein_date)}</Field>
      <Field label="Move-out Date">{formatDate(data.moveout_date)}</Field>
    </div>
  );
}

// ── Modal titles ──────────────────────────────────────────────────────────────

const MODAL_TITLE: Record<ReportType, string> = {
  occupancy:     "Room Details",
  application:   "Application Details",
  revenue:       "Transaction Details",
  accommodation: "Accommodation Record",
};

// ── Main modal ────────────────────────────────────────────────────────────────

interface Props {
  row:     DetailRow | null;
  onClose: () => void;
}

export default function ReportDetailModal({ row, onClose }: Props) {
  if (!row) return null;
  const [closeHovered, setCloseHovered] = useState(false);
  const [footerHovered, setFooterHovered] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0,
        background: "rgba(28,38,50,0.35)",
        backdropFilter: "blur(2px)", zIndex: 50,
      }} />

      {/* Modal */}
      <div style={{
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff", borderRadius: 14,
        boxShadow: "0 8px 40px rgba(28,38,50,0.18)",
        width: "100%", maxWidth: 520,
        zIndex: 51, fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px",
          borderBottom: `1px solid ${C.dividerLight}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.navy }}>
              {MODAL_TITLE[row.kind]}
            </div>
            <div style={{ fontSize: 11, color: C.teal, marginTop: 2 }}>View-only details</div>
          </div>
          <button onClick={onClose} onMouseEnter={() => setCloseHovered(true)} onMouseLeave={() => setCloseHovered(false)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: C.teal, fontSize: 18, lineHeight: 1, padding: 4,
            transform: closeHovered ? "translateY(-1px)" : "translateY(0)",
            transition: "transform 0.15s ease",
          }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px" }}>
          {row.kind === "occupancy"     && <OccupancyDetail     data={row.data} />}
          {row.kind === "application"   && <ApplicationDetail   data={row.data} />}
          {row.kind === "revenue"       && <RevenueDetail       data={row.data} />}
          {row.kind === "accommodation" && <AccommodationDetail data={row.data} />}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 20px",
          borderTop: `1px solid ${C.dividerLight}`,
          display: "flex", justifyContent: "flex-end",
        }}>
          <button onClick={onClose} onMouseEnter={() => setFooterHovered(true)} onMouseLeave={() => setFooterHovered(false)} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 600,
            background: "#fff", color: C.navy, border: `1px solid ${C.cream}`,
            borderRadius: 8, padding: "8px 20px", cursor: "pointer",
            transform: footerHovered ? "translateY(-1px)" : "translateY(0)",
            boxShadow: footerHovered ? "0 6px 14px rgba(28,38,50,0.08)" : "none",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}