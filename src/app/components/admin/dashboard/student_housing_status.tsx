import { C } from "@/lib/palette";

export interface HousingStatusData {
  label: string;
  count: number;
  color: string;
}

interface Props {
  data: HousingStatusData[];
}

export default function StudentHousingStatus({ data }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0);

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
      <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Student Housing Status</div>
      <div style={{ fontSize: 11, color: C.teal, marginTop: 2, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
        {total} total students
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {data.map((item) => {
          const pct = total === 0 ? 0 : Math.round((item.count / total) * 100);
          return (
            <div key={item.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 2,
                      background: item.color,
                      flexShrink: 0,
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 500, color: C.navy }}>{item.label}</span>
                </div>
                <span style={{ fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace" }}>
                  {item.count}{" "}
                  <span style={{ color: C.amber }}>({pct}%)</span>
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 6,
                  background: C.cream,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: item.color,
                    borderRadius: 6,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}