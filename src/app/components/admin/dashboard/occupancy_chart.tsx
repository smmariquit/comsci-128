import { C } from "@/lib/palette";

export interface OccupancyData {
  room_type: string;
  occupied: number;
  empty: number;
}

interface Props {
  data: OccupancyData[];
}

export default function OccupancyChart({ data }: Props) {
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
      <div style={{ fontSize: 14, fontWeight: 600, color: C.navy }}>Occupancy by Room Type</div>
      <div style={{ fontSize: 11, color: C.teal, marginTop: 2, marginBottom: 20, fontFamily: "'DM Mono', monospace" }}>
        Occupied vs empty rooms
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {[
          { label: "Occupied", color: C.orange },
          { label: "Empty",    color: C.cream  },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color, outline: `1px solid ${C.cream}` }} />
            <span style={{ fontSize: 11, color: C.teal }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.map((row) => {
          const total = row.occupied + row.empty;
          const occupiedPct = total === 0 ? 0 : (row.occupied / total) * 100;
          const emptyPct = 100 - occupiedPct;
          return (
            <div key={row.room_type}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: C.navy }}>{row.room_type}</span>
                <span style={{ fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace" }}>
                  {row.occupied}/{total}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  height: 8,
                  borderRadius: 6,
                  overflow: "hidden",
                  background: C.cream,
                }}
              >
                {occupiedPct > 0 && (
                  <div style={{ width: `${occupiedPct}%`, background: C.orange, transition: "width 0.5s ease" }} />
                )}
                {emptyPct > 0 && (
                  <div style={{ width: `${emptyPct}%`, background: C.cream }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}