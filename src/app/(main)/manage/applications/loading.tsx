export default function Loading() {
  return (
    <div
      className="min-h-screen text-[var(--cream)] flex flex-col gap-6 p-6"
      style={{ animation: "pulse 1.5s ease-in-out infinite" }}
    >
      {/* Page title + filters skeleton */}
      <div className="flex items-center justify-between">
        <div
          style={{
            background: "rgba(237,233,222,0.10)",
            borderRadius: 8,
            height: 32,
            width: 200,
          }}
        />
        <div
          style={{
            background: "rgba(237,233,222,0.08)",
            borderRadius: 8,
            height: 36,
            width: 280,
          }}
        />
      </div>

      {/* Table skeleton */}
      <div style={{ background: "rgba(237,233,222,0.06)", borderRadius: 12, height: 48 }} />
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            background: "rgba(237,233,222,0.04)",
            borderRadius: 8,
            height: 56,
            opacity: 1 - i * 0.12,
          }}
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
