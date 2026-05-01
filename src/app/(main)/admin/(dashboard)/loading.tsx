export default function Loading() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <style>{`
        @keyframes adminSkeletonPulse {
          0% { opacity: 0.55; }
          50% { opacity: 1; }
          100% { opacity: 0.55; }
        }
      `}</style>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            style={{
              height: 100,
              borderRadius: 12,
              background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
              backgroundSize: "200% 100%",
              animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
              outline: "1px solid #CEC7B0",
              outlineOffset: -1,
            }}
          />
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <div
          style={{
            height: 360,
            borderRadius: 12,
            background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
            backgroundSize: "200% 100%",
            animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
            outline: "1px solid #CEC7B0",
            outlineOffset: -1,
          }}
        />
        <div
          style={{
            height: 360,
            borderRadius: 12,
            background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
            backgroundSize: "200% 100%",
            animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
            outline: "1px solid #CEC7B0",
            outlineOffset: -1,
          }}
        />
        <div
          style={{
            height: 360,
            borderRadius: 12,
            background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
            backgroundSize: "200% 100%",
            animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
            outline: "1px solid #CEC7B0",
            outlineOffset: -1,
          }}
        />
      </section>

      <section
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, alignItems: "start" }}
      >
        <div
          style={{
            height: 340,
            borderRadius: 12,
            background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
            backgroundSize: "200% 100%",
            animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
            outline: "1px solid #CEC7B0",
            outlineOffset: -1,
          }}
        />
        <div
          style={{
            height: 340,
            borderRadius: 12,
            background: "linear-gradient(90deg, #ece8e0 25%, #f5f3ef 50%, #ece8e0 75%)",
            backgroundSize: "200% 100%",
            animation: "adminSkeletonPulse 1.4s ease-in-out infinite",
            outline: "1px solid #CEC7B0",
            outlineOffset: -1,
          }}
        />
      </section>
    </div>
  );
}
