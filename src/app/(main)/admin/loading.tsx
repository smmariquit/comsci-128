export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #eef0f4 0%, #f5f3ef 100%)",
        padding: 32,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#fff",
          borderRadius: 20,
          outline: "1px solid #CEC7B0",
          boxShadow: "0 18px 40px rgba(28,38,50,0.10)",
          padding: "28px 32px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "4px solid rgba(138,171,172,0.24)",
            borderTopColor: "#1D9E75",
            animation: "adminRouteSpin 0.9s linear infinite",
            flexShrink: 0,
          }}
        />
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1C2632" }}>
            Loading admin area
          </div>
          <div style={{ marginTop: 4, fontSize: 12, color: "#8AABAC", lineHeight: 1.5 }}>
            Fetching your dashboard, tables, and permissions.
          </div>
        </div>
        <style>{`@keyframes adminRouteSpin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
