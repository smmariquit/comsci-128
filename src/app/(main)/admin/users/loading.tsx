export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "24px",
        fontFamily: "'DM Sans', sans-serif",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      {/* Filter bar skeleton */}
      <div style={{ background: "#e2dfd6", borderRadius: 10, height: 48 }} />

      {/* Table skeleton */}
      <div style={{ background: "#e2dfd6", borderRadius: 12, height: 40 }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{ background: "#e2dfd6", borderRadius: 8, height: 56, opacity: 1 - i * 0.12 }}
        />
      ))}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
