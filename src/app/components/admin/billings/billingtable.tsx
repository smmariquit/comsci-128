import { C } from "@/lib/palette";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PaymentStatus = "Pending" | "Paid" | "Overdue";
export type BillType      = "Rent" | "Utility" | "Maintenance" | "Miscellaneous";

export interface BillRow {
  transaction_id:         number;
  student_name:           string;
  student_account_number: number;
  housing_name:           string;
  bill_type:              BillType;
  amount:                 number;
  status:                 PaymentStatus;
  due_date:               string; // ISO string
  issue_date:             string; // ISO string
  date_paid?:             string; // ISO string, only if Paid
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

export const MOCK_BILLS: BillRow[] = [
  {
    transaction_id: 3001,
    student_name: "Maria Santos",
    student_account_number: 1001,
    housing_name: "Kalayaan Residence Hall",
    bill_type: "Rent",
    amount: 5500,
    status: "Paid",
    due_date: "2025-04-05T00:00:00Z",
    issue_date: "2025-03-20T00:00:00Z",
    date_paid: "2025-04-03T00:00:00Z",
  },
  {
    transaction_id: 3002,
    student_name: "Juan dela Cruz",
    student_account_number: 1002,
    housing_name: "Kalayaan Residence Hall",
    bill_type: "Utility",
    amount: 850,
    status: "Pending",
    due_date: "2025-04-15T00:00:00Z",
    issue_date: "2025-04-01T00:00:00Z",
  },
  {
    transaction_id: 3003,
    student_name: "Ana Reyes",
    student_account_number: 1003,
    housing_name: "Kalayaan Residence Hall",
    bill_type: "Rent",
    amount: 5500,
    status: "Overdue",
    due_date: "2025-03-31T00:00:00Z",
    issue_date: "2025-03-15T00:00:00Z",
  },
  {
    transaction_id: 3004,
    student_name: "Ramon Bautista",
    student_account_number: 1006,
    housing_name: "Kalayaan Residence Hall",
    bill_type: "Maintenance",
    amount: 1200,
    status: "Pending",
    due_date: "2025-04-20T00:00:00Z",
    issue_date: "2025-04-05T00:00:00Z",
  },
  {
    transaction_id: 3005,
    student_name: "Maria Santos",
    student_account_number: 1001,
    housing_name: "Kalayaan Residence Hall",
    bill_type: "Miscellaneous",
    amount: 300,
    status: "Overdue",
    due_date: "2025-03-10T00:00:00Z",
    issue_date: "2025-02-28T00:00:00Z",
  },
  {
    transaction_id: 3006,
    student_name: "Ana Reyes",
    student_account_number: 1003,
    housing_name: "Kalayaan Residence Hall",
    bill_type: "Utility",
    amount: 720,
    status: "Paid",
    due_date: "2025-03-25T00:00:00Z",
    issue_date: "2025-03-10T00:00:00Z",
    date_paid: "2025-03-22T00:00:00Z",
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function formatPeso(amount: number) {
  return `₱${amount.toLocaleString("en-PH")}`;
}

// ── Payment status badge ──────────────────────────────────────────────────────

const STATUS_STYLE: Record<PaymentStatus, { bg: string; dot: string; text: string }> = {
  Paid:    { bg: "rgba(86,115,117,0.12)",  dot: C.teal,   text: C.teal },
  Pending: { bg: "rgba(227,175,100,0.18)", dot: "#D4A017", text: "#A07820" },
  Overdue: { bg: "rgba(201,100,42,0.13)",  dot: C.orange, text: C.orange },
};

function StatusBadge({ status }: { status: PaymentStatus }) {
  const s = STATUS_STYLE[status] || {
    bg: "rgba(0,0,0,0.05)", 
    dot: "#ccc", 
    text: "#666"
  };
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

// ── Bill type tag ─────────────────────────────────────────────────────────────

const BILL_TYPE_STYLE: Record<BillType, { bg: string; text: string }> = {
  Rent:          { bg: "rgba(86,115,117,0.13)",  text: C.teal },
  Utility:       { bg: "rgba(227,175,100,0.18)", text: "#A07820" },
  Maintenance:   { bg: "rgba(201,100,42,0.13)",  text: C.orange },
  Miscellaneous: { bg: "rgba(28,38,50,0.08)",    text: C.navy },
};

function BillTypeTag({ type }: { type: BillType }) {
  const s = BILL_TYPE_STYLE[type] || { 
    bg: "rgba(0,0,0,0.05)", 
    text: "#666" 
  };

  return (
    <span style={{
      background: s.bg,
      color: s.text,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 8px",
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
  ghost:   { background: "#fff",                        color: C.navy,   border: `1px solid ${C.cream}` },
  primary: { background: C.orange,                      color: "#fff",   border: "none" },
  danger:  { background: "rgba(201,100,42,0.10)",       color: C.orange, border: `1px solid rgba(201,100,42,0.2)` },
  warn:    { background: "rgba(227,175,100,0.15)",       color: "#A07820",border: `1px solid rgba(227,175,100,0.3)` },
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
  { key: "id",        label: "Txn ID" },
  { key: "student",   label: "Student" },
  { key: "property",  label: "Property" },
  { key: "type",      label: "Type" },
  { key: "amount",    label: "Amount" },
  { key: "status",    label: "Status" },
  { key: "issued",    label: "Issued" },
  { key: "due",       label: "Due Date" },
  { key: "paid",      label: "Date Paid" },
  { key: "actions",   label: "Actions" },
];

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  data:        BillRow[];
  onView:      (row: BillRow) => void;
  onMarkPaid:  (row: BillRow) => void;
  onDelete:    (row: BillRow) => void;
}

// ── Table ─────────────────────────────────────────────────────────────────────

export default function BillTable({ data, onView, onMarkPaid, onDelete }: Props) {
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
          <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Billing Statements</div>
          <div style={{ fontSize: 11, color: C.teal }}>{data.length} total</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: C.cream }}>
              {COLUMNS.map((col) => (
                <th key={col.key} style={{
                  padding: "8px 14px",
                  textAlign: "left",
                  fontSize: 10,
                  color: C.teal,
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
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
                  padding: "32px 14px",
                  textAlign: "center",
                  color: C.teal,
                  opacity: 0.5,
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  No bills found.
                </td>
              </tr>
            ) : data.map((row, i) => {
              const isPaid = row.status === "Paid";
              return (
                <tr
                  key={row.transaction_id}
                  onMouseEnter={() => setHoveredRow(i)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`,
                    background: hoveredRow === i ? "rgba(28,38,50,0.03)" : "transparent",
                    transition: "background 0.15s ease",
                  }}
                >
                  {/* Txn ID */}
                  <td style={{ padding: "8px 14px", fontFamily: "monospace", color: C.teal, fontWeight: 500 }}>
                    #{row.transaction_id}
                  </td>

                  {/* Student */}
                  <td style={{ padding: "8px 14px", color: C.navy, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {row.student_name}
                  </td>

                  {/* Property */}
                  <td style={{ padding: "8px 14px", color: C.navy, fontWeight: 500, whiteSpace: "nowrap" }}>
                    {row.housing_name}
                  </td>

                  {/* Type */}
                  <td style={{ padding: "8px 14px" }}>
                    <BillTypeTag type={row.bill_type} />
                  </td>

                  {/* Amount */}
                  <td style={{ padding: "8px 14px", fontFamily: "monospace", color: C.navy, fontWeight: 600 }}>
                    {formatPeso(row.amount)}
                  </td>

                  {/* Status */}
                  <td style={{ padding: "8px 14px" }}>
                    <StatusBadge status={row.status} />
                  </td>

                  {/* Issue Date */}
                  <td style={{ padding: "8px 14px", color: C.teal, whiteSpace: "nowrap" }}>
                    {formatDate(row.issue_date)}
                  </td>

                  {/* Due Date */}
                  <td style={{ padding: "8px 14px", whiteSpace: "nowrap" }}>
                    <span style={{
                      color: row.status === "Overdue" ? C.orange : C.navy,
                      fontWeight: row.status === "Overdue" ? 600 : 400,
                    }}>
                      {formatDate(row.due_date)}
                    </span>
                  </td>

                  {/* Date Paid */}
                  <td style={{ padding: "8px 14px", color: C.teal, whiteSpace: "nowrap" }}>
                    {row.date_paid
                      ? formatDate(row.date_paid)
                      : <span style={{ opacity: 0.35 }}>—</span>}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: "8px 14px" }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <ActionBtn label="View"     onClick={() => onView(row)} />
                      <ActionBtn
                        label="Mark Paid"
                        onClick={() => onMarkPaid(row)}
                        variant="warn"
                        disabled={isPaid}
                      />
                      <ActionBtn
                        label="Delete"
                        onClick={() => onDelete(row)}
                        variant="danger"
                        disabled={isPaid}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}