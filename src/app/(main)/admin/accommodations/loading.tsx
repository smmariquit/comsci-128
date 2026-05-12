function SkeletonBlock({ style }: { style: React.CSSProperties }) {
  return <div style={style} />;
}

function DormCardSkeleton() {
  const shimmer: React.CSSProperties = {
    background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
    backgroundSize: "200% 100%",
    animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        outline: "1px solid #CEC7B0",
        outlineOffset: -1,
        overflow: "hidden",
      }}
    >
      <SkeletonBlock style={{ ...shimmer, height: 160 }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          borderTop: "1px solid #EDE9DE",
          borderBottom: "1px solid #EDE9DE",
        }}
      >
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              padding: "12px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              borderRight: idx < 2 ? "1px solid #EDE9DE" : undefined,
            }}
          >
            <SkeletonBlock style={{ ...shimmer, width: 28, height: 16, borderRadius: 6 }} />
            <SkeletonBlock style={{ ...shimmer, width: 44, height: 8, borderRadius: 99 }} />
          </div>
        ))}
      </div>

      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <SkeletonBlock style={{ ...shimmer, width: 74, height: 10, borderRadius: 99 }} />
          <SkeletonBlock style={{ ...shimmer, width: 36, height: 10, borderRadius: 99 }} />
        </div>
        <SkeletonBlock style={{ ...shimmer, width: "100%", height: 6, borderRadius: 99 }} />
      </div>

      <div
        style={{
          borderTop: "1px solid #EDE9DE",
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SkeletonBlock style={{ ...shimmer, width: 96, height: 14, borderRadius: 99 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <SkeletonBlock style={{ ...shimmer, width: 62, height: 28, borderRadius: 8 }} />
          <SkeletonBlock style={{ ...shimmer, width: 74, height: 28, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <section style={{ width: "100%", maxWidth: 1152, margin: "0 auto" }}>
        <div className="accom-skeleton-grid" style={{ display: "grid", gap: 24 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <DormCardSkeleton key={index} />
          ))}
        </div>
      </section>

      <style>{`
        .accom-skeleton-grid {
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .accom-skeleton-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (min-width: 1024px) {
          .accom-skeleton-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
        @keyframes adminSkeletonPulse {
          0% { opacity: 0.55; }
          50% { opacity: 1; }
          100% { opacity: 0.55; }
        }
      `}</style>
    </main>
  );
}
