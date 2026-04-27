import { C } from "@/lib/palette";

export type ApplicationStatus = "Pending" | "Approved" | "Rejected" | "Cancelled";

export interface ApplicationRow {
  application_id: number;
  housing_name: string;
  preferred_room_type: string;
  application_status: ApplicationStatus;
  expected_moveout_date: string;
  student_name: string;
}

const STATUS_STYLES: Record<ApplicationStatus, { bg: string; text: string }> = {
  Pending:   C.statusPending,
  Approved:  C.statusApproved,
  Rejected:  C.statusRejected,
  Cancelled: C.statusCancelled,
};

interface Props {
  data: ApplicationRow[];
}

export default function RecentApplications({ data }: Props) {
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
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Recent Applications</div>
        <div style={{ fontSize: 11, color: C.teal, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
          Latest housing application requests
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.cream }}>
              {["Student", "Housing", "Room Type", "Expected Move-out", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 24px",
                    textAlign: "left",
                    fontSize: 10,
                    fontWeight: 600,
                    color: C.teal,
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                    whiteSpace: "nowrap",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => {
              const s = STATUS_STYLES[row.application_status] || {
                bg: "rgba(0,0,0,0.5)",
                text: "#666"
              };
              return (
                <tr
                  key={row.application_id}
                  style={{ borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}` }}
                >
                  <td style={{ padding: "12px 24px", color: C.navy, fontWeight: 500 }}>{row.student_name}</td>
                  <td style={{ padding: "12px 24px", color: C.teal }}>{row.housing_name}</td>
                  <td style={{ padding: "12px 24px", color: C.teal }}>{row.preferred_room_type}</td>
                  <td style={{ padding: "12px 24px", color: C.teal, fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                    {row.expected_moveout_date}
                  </td>
                  <td style={{ padding: "12px 24px" }}>
                    <span
                      style={{
                        background: s.bg,
                        color: s.text,
                        fontSize: 10,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontFamily: "'DM Mono', monospace",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      {row.application_status}
                    </span>
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