import { C } from "@/lib/palette";
import type { AuditLogRow } from "./audit";
import { ActionType } from "@/app/lib/models/audit_log";

// ── Action Badge ──────────────────────────────────────────────────────────────

const ACTION_STYLES: Record<ActionType, string> = {
  "Application Status": "bg-blue-100 text-blue-700",
  "Bill Status": "bg-amber-100 text-amber-700",
  "Auth Register": "bg-emerald-100 text-emerald-700",
  "Auth Login": "bg-orange-100 text-orange-700",
  "Change Auth Password": "bg-yellow-100 text-yellow-700",
  "Delete Account": "bg-rose-100 text-rose-700",
  "Update User Role": "bg-purple-100 text-purple-700",
  "Submit Application": "bg-sky-100 text-sky-700",
  "Update Application Status": "bg-indigo-100 text-indigo-700",
  "Withdraw Application": "bg-red-100 text-red-700",
  "Create Housing": "bg-teal-100 text-teal-700",
  "Update Housing": "bg-cyan-100 text-cyan-700",
  "Assign Room": "bg-lime-100 text-lime-700",
  "Assign Bill": "bg-orange-100 text-orange-700",
  "Update Bill Status": "bg-amber-100 text-amber-700",
  "Issue Bill Refund": "bg-green-100 text-green-700",
  "Update User Details": "bg-purple-100 text-purple-700",
};


function ActionBadge({ type }: { type: ActionType }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-[11px] font-semibold ${ACTION_STYLES[type]}`}
    >
      {type}
    </span>
  );
}

// ── Columns ───────────────────────────────────────────────────────────────────

const COLUMNS = [
  { key: "timestamp", label: "Timestamp" },
  { key: "user", label: "User" },
  { key: "action", label: "Action" },
  { key: "description", label: "Description" },
];
// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  data: AuditLogRow[];
  onView: (row: AuditLogRow) => void;
}

// ── Table ─────────────────────────────────────────────────────────────────────

export default function AuditLogTable({ data, onView }: Props) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        border: "1px solid rgba(26,35,50,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 18px",
          borderBottom: `1px solid ${C.dividerLight}`,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
          Audit Logs
        </div>
        <div style={{ fontSize: 11, color: C.teal }}>{data.length} total</div>
      </div>

      {/* Table */}
      <table style={{ width: "100%", fontSize: 12, borderCollapse: "separate", borderSpacing: 0 }}>
        <thead>
          <tr style={{ background: "rgba(234,232,225,0.5)", borderBottom: "1px solid rgba(26,35,50,0.06)" }}>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "8px 14px",
                  textAlign: "left",
                  fontSize: 10,
                  color: C.teal,
                  textTransform: "uppercase",
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.audit_id}>
              {/* Timestamp */}
              <td
                style={{
                  padding: "8px 14px",
                  fontFamily: "monospace",
                  color: C.navy,
                }}
              >
                {new Date(row.timestamp).toLocaleString()}
              </td>

              {/* User */}
              <td style={{ padding: "8px 14px", color: C.navy }}>
                {row.user_name}
                <div style={{ fontSize: 10, color: C.teal }}>
                  #{row.account_number}
                </div>
              </td>

              {/* Action */}
              <td style={{ padding: "8px 14px", color: C.navy }}>
              <ActionBadge type={row.action_type} />
              </td>

              {/* Description */}
              <td style={{ padding: "8px 14px", color: C.navy }}>
                {row.audit_description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
