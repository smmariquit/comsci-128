export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      {/* Stat cards skeleton */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              background: "#e2dfd6",
              borderRadius: 12,
              height: 100,
            }}
          />
        ))}
      </section>

      {/* Charts skeleton */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 16,
        }}
      >
        <div style={{ background: "#e2dfd6", borderRadius: 12, height: 260 }} />
        <div style={{ background: "#e2dfd6", borderRadius: 12, height: 260 }} />
        <div style={{ background: "#e2dfd6", borderRadius: 12, height: 260 }} />
      </section>

      {/* Table skeleton */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        <div style={{ background: "#e2dfd6", borderRadius: 12, height: 200 }} />
        <div style={{ background: "#e2dfd6", borderRadius: 12, height: 200 }} />
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
