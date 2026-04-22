import { C } from "@/lib/palette";

export interface UserTypeCount {
  label: string;
  count: number;
}

interface Props {
  data: UserTypeCount[];
  total: number;
}

export default function ActiveUsers({ data, total }: Props) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        outline: `1px solid ${C.cream}`,
        outlineOffset: -1,
        fontFamily: "'DM Sans', sans-serif",
        padding: "18px 24px 24px",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Active Users</div>
      <div style={{ fontSize: 11, color: C.teal, marginTop: 2, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
        {total} total non-deleted accounts
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {data.map((item) => (
          <div
            key={item.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              background: C.cream,
              borderRadius: 8,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 500, color: C.navy }}>{item.label}</span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.navy,
                background: C.amber,
                padding: "2px 10px",
                borderRadius: 20,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}