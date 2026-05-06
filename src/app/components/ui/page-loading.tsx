export default function PageLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EDE9DE]">
      <div className="flex flex-col items-center gap-6">
        {/* Orbital spinner */}
        <div className="relative w-16 h-16">
          {/* Outer ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-[#E3AF64]/30"
            style={{ animation: "page-loading-spin 2.4s linear infinite" }}
          />
          {/* Primary arc */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent"
            style={{
              borderTopColor: "#C9642A",
              borderRightColor: "#C9642A",
              animation: "page-loading-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
            }}
          />
          {/* Secondary arc (counter-rotating) */}
          <div
            className="absolute inset-[6px] rounded-full border-2 border-transparent"
            style={{
              borderBottomColor: "#567375",
              borderLeftColor: "#567375",
              animation: "page-loading-spin 1.6s cubic-bezier(0.5, 0, 0.5, 1) infinite reverse",
            }}
          />
          {/* Inner dot */}
          <div
            className="absolute inset-[18px] rounded-full bg-[#C9642A]"
            style={{ animation: "page-loading-pulse 1.2s ease-in-out infinite" }}
          />
        </div>

        {/* Label with shimmer */}
        <span
          className="text-sm font-semibold tracking-wider uppercase text-[#567375]"
          style={{ animation: "page-loading-fade 1.8s ease-in-out infinite" }}
        >
          {label}
        </span>
      </div>

      <style>{`
        @keyframes page-loading-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes page-loading-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.6); opacity: 0.5; }
        }
        @keyframes page-loading-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
