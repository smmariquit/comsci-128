export default function Loading() {
  return (
    <div
      className="min-h-screen text-[var(--cream)] flex flex-col gap-6 p-6"
      style={{ animation: "pulse 1.5s ease-in-out infinite" }}
    >
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: "rgba(237,233,222,0.08)",
              borderRadius: 12,
              height: 90,
            }}
          />
        ))}
      </div>

      {/* Dorm cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              background: "rgba(237,233,222,0.08)",
              borderRadius: 12,
              height: 140,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
