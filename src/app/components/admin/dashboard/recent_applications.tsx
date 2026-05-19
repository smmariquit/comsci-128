import { C } from "@/lib/palette";

import { Badge } from "@/app/components/ui/Badge";

export type ApplicationStatus =
  | "Pending"
  | "Pending Manager Approval"
  | "Pending Admin Approval"
  | "Approved"
  | "Rejected"
  | "Cancelled";

export interface ApplicationRow {
  application_id: number;
  housing_name: string;
  preferred_room_type: string;
  application_status: ApplicationStatus;
  expected_moveout_date: string;
  student_name: string;
}

const STATUS_STYLES: Record<
  ApplicationStatus,
  { bg: string; text: string; dot: string }
> = {
  Pending: { ...C.statusPending, dot: C.amber },
  "Pending Manager Approval": { ...C.statusPending, dot: C.amber },
  "Pending Admin Approval": { ...C.statusPending, dot: C.amber },
  Approved: { ...C.statusApproved, dot: C.teal },
  Rejected: { ...C.statusRejected, dot: C.orange },
  Cancelled: { ...C.statusCancelled, dot: C.navy },
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
      <div
        style={{
          padding: "18px 24px 14px",
          borderBottom: `1px solid ${C.dividerLight}`,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>
          Recent Applications
        </div>
        <div
          style={{
            fontSize: 13,
            color: C.teal,
            marginTop: 2,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Latest housing application requests
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: C.cream }}>
              {[
                "Student",
                "Housing",
                "Room Type",
                "Expected Move-out",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 24px",
                    textAlign: "left",
                    fontSize: 13,
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
                bg: "rgba(0,0,0,0.05)",
                text: "#666",
                dot: "#666",
              };
              return (
                <tr
                  key={row.application_id}
                  style={{
                    borderTop: i === 0 ? "none" : `1px solid ${C.dividerLight}`,
                  }}
                >
                  <td
                    style={{
                      padding: "12px 24px",
                      color: C.navy,
                      fontWeight: 500,
                    }}
                  >
                    {row.student_name}
                  </td>
                  <td style={{ padding: "12px 24px", color: C.teal }}>
                    {row.housing_name}
                  </td>
                  <td style={{ padding: "12px 24px", color: C.teal }}>
                    {row.preferred_room_type}
                  </td>
                  <td
                    style={{
                      padding: "12px 24px",
                      color: C.teal,
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 13,
                    }}
                  >
                    {row.expected_moveout_date}
                  </td>
                  <td style={{ padding: "12px 24px" }}>
                    <Badge label={row.application_status} {...s} />
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
