import { C } from "@/lib/palette";

interface StatCardProps {
  label: string;
  value: string | number;
  delta?: number;
  deltaSub?: string;
}

export default function StatCard({ label, value, delta, deltaSub }: StatCardProps) {
  const isPositive = delta === undefined || delta >= 0;
  // Up = amber, down = orange (both from palette)
  const deltaColor = isPositive ? C.amber : C.orange;
  const deltaArrow = isPositive ? "↑" : "↓";

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        position: "relative",
        background: "#fff",
        borderRadius: 12,
        outline: `1px solid ${C.cream}`,
        outlineOffset: -1,
        height: 100,
      }}
    >
      {/* Label */}
      <div
        style={{
          position: "absolute",
          left: 19,
          top: 17,
          color: C.teal,
          fontSize: 10.5,
          fontFamily: "'DM Mono', monospace",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: 0.9,
        }}
      >
        {label}
      </div>

      {/* Value */}
      <div
        style={{
          position: "absolute",
          left: 19,
          top: 38,
          color: C.navy,
          fontSize: 26,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          lineHeight: "26px",
        }}
      >
        {value}
      </div>

      {/* Delta row */}
      {(delta !== undefined || deltaSub) && (
        <div
          style={{
            position: "absolute",
            left: 19,
            top: 70,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {delta !== undefined && (
            <span
              style={{
                color: deltaColor,
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 600,
              }}
            >
              {deltaArrow} {Math.abs(delta)}
            </span>
          )}
          {deltaSub && (
            <span
              style={{
                color: C.teal,
                fontSize: 11,
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 400,
              }}
            >
              {deltaSub}
            </span>
          )}
        </div>
      )}
    </div>
  );
}