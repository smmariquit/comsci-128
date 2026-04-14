import React from "react";
import { C } from "@/lib/palette";
import type {
  OccupancyStatus, RoomType, ApplicationStatus, PaymentStatus, BillType,
} from "./reportsmock";

// ── StatCard (exact design from user) ────────────────────────────────────────

interface StatCardProps {
  label:    string;
  value:    string | number;
  delta?:   number;
  deltaSub?:string;
}

export function StatCard({ label, value, delta, deltaSub }: StatCardProps) {
  const isPositive  = delta === undefined || delta >= 0;
  const deltaColor  = isPositive ? C.amber : C.orange;
  const deltaArrow  = isPositive ? "↑" : "↓";

  return (
    <div style={{
      flex: 1,
      minWidth: 0,
      position: "relative",
      background: "#fff",
      borderRadius: 12,
      outline: `1px solid ${C.cream}`,
      outlineOffset: -1,
      height: 100,
    }}>
      <div style={{
        position: "absolute", left: 19, top: 17,
        color: C.teal, fontSize: 10.5,
        fontFamily: "'DM Mono', monospace",
        fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.9,
      }}>
        {label}
      </div>
      <div style={{
        position: "absolute", left: 19, top: 38,
        color: C.navy, fontSize: 26,
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 600, lineHeight: "26px",
      }}>
        {value}
      </div>
      {(delta !== undefined || deltaSub) && (
        <div style={{ position: "absolute", left: 19, top: 70, display: "flex", alignItems: "center", gap: 4 }}>
          {delta !== undefined && (
            <span style={{ color: deltaColor, fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              {deltaArrow} {Math.abs(delta)}
            </span>
          )}
          {deltaSub && (
            <span style={{ color: C.teal, fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 400 }}>
              {deltaSub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── Action button ─────────────────────────────────────────────────────────────

type BtnVariant = "ghost" | "primary" | "danger";

const BTN_STYLE: Record<BtnVariant, React.CSSProperties> = {
  ghost:   { background: "#fff",                  color: C.navy,   border: `1px solid ${C.cream}` },
  primary: { background: C.orange,                color: "#fff",   border: "none" },
  danger:  { background: "rgba(201,100,42,0.10)", color: C.orange, border: `1px solid rgba(201,100,42,0.2)` },
};

export function ActionBtn({ label, onClick, variant = "ghost", disabled }: {
  label: string; onClick: () => void; variant?: BtnVariant; disabled?: boolean;
}) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...BTN_STYLE[variant],
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11, padding: "4px 10px", borderRadius: 6,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
    }}>
      {label}
    </button>
  );
}

// ── Table shell ───────────────────────────────────────────────────────────────

export function TableShell({ title, count, children }: {
  title: string; count: number; children: React.ReactNode;
}) {
  return (
    <div style={{ background:"#fff", borderRadius:12, outline:`1px solid ${C.cream}`, overflow:"hidden" }}>
      <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.dividerLight}` }}>
        <div style={{ fontSize:14, fontWeight:600, color:C.navy }}>{title}</div>
        <div style={{ fontSize:11, color:C.teal }}>{count} total</div>
      </div>
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
          {children}
        </table>
      </div>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{
      padding:"8px 14px", textAlign:"left", fontSize:10,
      color:C.teal, textTransform:"uppercase",
      fontFamily:"'DM Sans', sans-serif", fontWeight:600, whiteSpace:"nowrap",
      background: C.cream,
    }}>
      {children}
    </th>
  );
}

export function Td({ children, mono, bold, muted }: {
  children: React.ReactNode; mono?: boolean; bold?: boolean; muted?: boolean;
}) {
  return (
    <td style={{
      padding:"8px 14px", whiteSpace:"nowrap",
      fontFamily: mono ? "monospace" : "'DM Sans', sans-serif",
      color: muted ? C.teal : C.navy,
      fontWeight: bold ? 600 : 400,
    }}>
      {children}
    </td>
  );
}

export function EmptyRow({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} style={{
        padding:"32px 14px", textAlign:"center",
        color:C.teal, opacity:0.5, fontSize:12,
        fontFamily:"'DM Sans', sans-serif",
      }}>
        No records found.
      </td>
    </tr>
  );
}

// ── Badges ────────────────────────────────────────────────────────────────────

export function DotBadge({ label, bg, dot, text }: { label:string; bg:string; dot:string; text:string }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center", gap:5,
      background:bg, color:text,
      fontSize:11, fontWeight:600, padding:"3px 8px", borderRadius:20, whiteSpace:"nowrap",
    }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:dot }} />
      {label}
    </span>
  );
}

export function Tag({ label, bg, text }: { label:string; bg:string; text:string }) {
  return (
    <span style={{
      background:bg, color:text,
      fontSize:10, fontWeight:600,
      padding:"2px 8px", borderRadius:6, whiteSpace:"nowrap",
    }}>
      {label}
    </span>
  );
}

// ── Typed badge helpers ───────────────────────────────────────────────────────

const OCC_S: Record<OccupancyStatus, { bg:string; dot:string; text:string }> = {
  Empty:              { bg:"rgba(86,115,117,0.12)",  dot:C.teal,   text:C.teal },
  "Partially Occupied":           { bg:"rgba(201,100,42,0.13)",  dot:C.orange, text:C.orange },
  // Reserved:           { bg:"rgba(227,175,100,0.18)", dot:"#D4A017",text:"#A07820" },
  "Fully Occupied":{ bg:"rgba(28,38,50,0.08)",    dot:C.navy,   text:C.navy },
};
export function OccupancyBadge({ status }: { status: OccupancyStatus }) {
  const s = OCC_S[status];
  return <DotBadge label={status} {...s} />;
}

const ROOM_T: Record<RoomType, { bg:string; text:string }> = {
  "Women Only":   { bg:"rgba(86,115,117,0.14)",  text:C.teal },
  // Double:   { bg:"rgba(227,175,100,0.18)", text:"#A07820" },
  "Men Only":    { bg:"rgba(201,100,42,0.13)",  text:C.orange },
  "Co-ed": { bg:"rgba(28,38,50,0.08)",    text:C.navy },
};
export function RoomTypeTag({ type }: { type: RoomType }) {
  const s = ROOM_T[type];
  return <Tag label={type} {...s} />;
}

const APP_S: Record<ApplicationStatus, { bg:string; dot:string; text:string }> = {
  Approved:  { bg:"rgba(86,115,117,0.12)",  dot:C.teal,   text:C.teal },
  Pending:   { bg:"rgba(227,175,100,0.18)", dot:"#D4A017",text:"#A07820" },
  Rejected:  { bg:"rgba(201,100,42,0.13)",  dot:C.orange, text:C.orange },
  Cancelled: { bg:"rgba(28,38,50,0.08)",    dot:C.navy,   text:C.navy },
};
export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const s = APP_S[status];
  return <DotBadge label={status} {...s} />;
}

const PAY_S: Record<PaymentStatus, { bg:string; dot:string; text:string }> = {
  Paid:    { bg:"rgba(86,115,117,0.12)",  dot:C.teal,   text:C.teal },
  Pending: { bg:"rgba(227,175,100,0.18)", dot:"#D4A017",text:"#A07820" },
  Overdue: { bg:"rgba(201,100,42,0.13)",  dot:C.orange, text:C.orange },
};
export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const s = PAY_S[status];
  return <DotBadge label={status} {...s} />;
}

const BILL_T: Record<BillType, { bg:string; text:string }> = {
  Rent:          { bg:"rgba(86,115,117,0.13)",  text:C.teal },
  Utility:       { bg:"rgba(227,175,100,0.18)", text:"#A07820" },
  Maintenance:   { bg:"rgba(201,100,42,0.13)",  text:C.orange },
  Miscellaneous: { bg:"rgba(28,38,50,0.08)",    text:C.navy },
};
export function BillTypeTag({ type }: { type: BillType }) {
  const s = BILL_T[type];
  return <Tag label={type} {...s} />;
}

// ── Export button ─────────────────────────────────────────────────────────────

export function ExportButton({ onExportCSV, onExportPDF }: {
  onExportCSV: () => void;
  onExportPDF: () => void;
}) {
  return (
    <div style={{ display:"flex", gap:6 }}>
      <button onClick={onExportCSV} style={{
        fontFamily:"'DM Sans', sans-serif", fontSize:12, fontWeight:600,
        background:"#fff", color:C.navy, border:`1px solid ${C.cream}`,
        borderRadius:8, padding:"8px 14px", cursor:"pointer",
        display:"flex", alignItems:"center", gap:6,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={C.teal} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        CSV
      </button>
      <button onClick={onExportPDF} style={{
        fontFamily:"'DM Sans', sans-serif", fontSize:12, fontWeight:600,
        background:C.orange, color:"#fff", border:"none",
        borderRadius:8, padding:"8px 14px", cursor:"pointer",
        display:"flex", alignItems:"center", gap:6,
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        PDF
      </button>
    </div>
  );
}