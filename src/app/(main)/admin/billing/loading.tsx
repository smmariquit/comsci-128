function SkeletonBlock({ style }: { style: React.CSSProperties }) {
  return <div style={style} />;
}

export default function Loading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonBlock
            key={index}
            style={{
              height: 92,
              borderRadius: 12,
              background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
              backgroundSize: "200% 100%",
              animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
              outline: "1px solid #CEC7B0",
              outlineOffset: -1,
            }}
          />
        ))}
      </div>
      <SkeletonBlock
        style={{
          height: 58,
          borderRadius: 12,
          background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
          backgroundSize: "200% 100%",
          animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
          outline: "1px solid #CEC7B0",
          outlineOffset: -1,
        }}
      />
      <SkeletonBlock
        style={{
          height: 430,
          borderRadius: 12,
          background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
          backgroundSize: "200% 100%",
          animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
          outline: "1px solid #CEC7B0",
          outlineOffset: -1,
        }}
      />
      <style>{`
        @keyframes adminSkeletonPulse {
          0% { opacity: 0.55; }
          50% { opacity: 1; }
          100% { opacity: 0.55; }
        }
      `}</style>
    </div>
  );
}
