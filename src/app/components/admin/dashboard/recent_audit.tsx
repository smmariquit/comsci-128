import { C } from "@/lib/palette";

export interface AuditLogRow {
  audit_id: number;
  timestamp: string;
  action_type: string;
  audit_description: string;
  user_name: string;
}

const ACTION_STYLES: Record<string, { bg: string; text: string }> = {
  Create: C.actionCreate,
  Update: C.actionUpdate,
  Delete: C.actionDelete,
  Login:  C.actionLogin,
  Logout: C.actionLogout,
};

const FALLBACK = { bg: C.cream, text: C.teal };

interface Props {
  data: AuditLogRow[];
}

export default function RecentAuditLog({ data }: Props) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        outline: `1px solid ${C.cream}`,
        outlineOffset: -1,
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ padding: "18px 24px 14px", borderBottom: `1px solid ${C.dividerLight}` }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Recent Audit Activity</div>
        <div style={{ fontSize: 11, color: C.teal, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
          Latest system actions
        </div>
      </div>

      {/* Feed */}
      <div style={{ padding: "8px 0" }}>
        {data.map((entry, i) => {
          const style = ACTION_STYLES[entry.action_type] ?? FALLBACK;
          return (
            <div
              key={entry.audit_id}
              style={{
                display: "flex",
                gap: 14,
                padding: "12px 24px",
                borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`,
                alignItems: "flex-start",
              }}
            >
              {/* Action badge */}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "3px 9px",
                  borderRadius: 20,
                  background: style.bg,
                  color: style.text,
                  whiteSpace: "nowrap",
                  marginTop: 2,
                  flexShrink: 0,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {entry.action_type}
              </span>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: C.navy, fontWeight: 500 }}>
                  {entry.audit_description}
                </div>
                <div style={{ fontSize: 11, color: C.teal, marginTop: 3, fontFamily: "'DM Mono', monospace" }}>
                  by{" "}
                  <span style={{ color: C.orange, fontWeight: 600 }}>{entry.user_name}</span>
                  {" · "}
                  {entry.timestamp}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}