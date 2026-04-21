import { C } from "@/lib/palette";
import type { AuditLogRow, ActionType } from "./audit";

// ── Action Badge ──────────────────────────────────────────────────────────────

const ACTION_STYLE: Record<ActionType, { bg: string; text: string }> = {
  LOGIN: { bg: "rgba(86,115,117,0.13)", text: C.teal },
  APPROVE_APPLICATION: { bg: "rgba(86,115,117,0.18)", text: C.teal },
  ASSIGN_ROOM: { bg: "rgba(28,38,50,0.08)", text: C.navy },
  BILL_UPDATE: { bg: "rgba(201,100,42,0.13)", text: C.orange },
  LOGOUT: { bg: "rgba(227,175,100,0.18)", text: "#A07820" },
};

function ActionBadge({ type }: { type: ActionType }) {
  const s = ACTION_STYLE[type];
  return (
    <span style={{
      background: s.bg,
      color: s.text,
      fontSize: 10,
      fontWeight: 600,
      padding: "2px 8px",
      borderRadius: 6,
    }}>
      {type.replaceAll("_", " ")}
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
    <div style={{
      background: "#fff",
      borderRadius: 12,
      outline: `1px solid ${C.cream}`,
      overflow: "hidden",
    }}>
      
      {/* Header */}
      <div style={{
        padding: "12px 18px",
        borderBottom: `1px solid ${C.dividerLight}`,
      }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
          Audit Logs
        </div>
        <div style={{ fontSize: 11, color: C.teal }}>
          {data.length} total
        </div>
      </div>

      {/* Table */}
      <table style={{ width: "100%", fontSize: 12 }}>
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
              <td style={{ padding: "8px 14px", fontFamily: "monospace", color: C.navy }}>
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
              <td style={{ padding: "8px 14px", color: C.navy   }}>
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