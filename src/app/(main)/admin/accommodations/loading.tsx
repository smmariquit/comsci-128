function SkeletonBlock({ style }: { style: React.CSSProperties }) {
  return <div style={style} />;
}

export default function Loading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SkeletonBlock
        style={{
          height: 320,
          borderRadius: 18,
          background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
          backgroundSize: "200% 100%",
          animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
          outline: "1px solid #CEC7B0",
          outlineOffset: -1,
        }}
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 16 }}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonBlock
            key={index}
            style={{
              height: 180,
              borderRadius: 18,
              background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
              backgroundSize: "200% 100%",
              animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
              outline: "1px solid #CEC7B0",
              outlineOffset: -1,
            }}
          />
        ))}
      </div>
      <style>{`@keyframes adminSkeletonPulse { 0% { opacity: 0.55; } 50% { opacity: 1; } 100% { opacity: 0.55; } }`}</style>
    </div>
  );
}
