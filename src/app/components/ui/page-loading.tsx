export default function PageLoading({ 
  label = "Loading", 
  overlay = false,
  variant = 'fullscreen'
}: { 
  label?: string;
  overlay?: boolean;
  variant?: 'fullscreen' | 'overlay' | 'container';
}) {
  const isOverlay = overlay || variant === 'overlay';
  
  let containerClass = "min-h-screen w-full flex items-center justify-center bg-[#EDE9DE]";
  if (isOverlay) {
    containerClass = "fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm";
  } else if (variant === 'container') {
    containerClass = "absolute inset-0 z-50 flex items-center justify-center bg-[#EDE9DE]";
  }

  return (
    <div className={containerClass}>
      <div className={`flex flex-col items-center gap-6 ${isOverlay ? 'bg-[#EDE9DE] p-10 rounded-[20px] shadow-2xl border border-white/20' : ''}`}>
        {/* Animated house icon — built stroke by stroke */}
        <div className="relative w-16 h-16">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16"
          >
            {/* Roof — triangle */}
            <path
              d="M32 8 L56 30 L8 30 Z"
              stroke="#C9642A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 120,
                strokeDashoffset: 120,
                animation: "house-draw-roof 1.2s ease-out forwards",
              }}
            />
            {/* Walls — rectangle */}
            <path
              d="M14 30 L14 54 L50 54 L50 30"
              stroke="#567375"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 120,
                strokeDashoffset: 120,
                animation: "house-draw-walls 1s ease-out 0.4s forwards",
              }}
            />
            {/* Door */}
            <rect
              x="26"
              y="38"
              width="12"
              height="16"
              rx="1"
              stroke="#1C2632"
              strokeWidth="2"
              fill="none"
              style={{
                strokeDasharray: 60,
                strokeDashoffset: 60,
                animation: "house-draw-door 0.8s ease-out 0.9s forwards",
              }}
            />
            {/* Door knob */}
            <circle
              cx="35"
              cy="47"
              r="1.2"
              fill="#E3AF64"
              style={{
                opacity: 0,
                animation: "house-fade-in 0.4s ease-out 1.5s forwards",
              }}
            />
            {/* Window left */}
            <rect
              x="17"
              y="36"
              width="7"
              height="7"
              rx="0.5"
              stroke="#E3AF64"
              strokeWidth="1.5"
              fill="none"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: 30,
                animation: "house-draw-window 0.6s ease-out 1.1s forwards",
              }}
            />
            {/* Window right */}
            <rect
              x="40"
              y="36"
              width="7"
              height="7"
              rx="0.5"
              stroke="#E3AF64"
              strokeWidth="1.5"
              fill="none"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: 30,
                animation: "house-draw-window 0.6s ease-out 1.2s forwards",
              }}
            />
            {/* Warm glow from windows */}
            <rect
              x="18"
              y="37"
              width="5"
              height="5"
              rx="0.5"
              fill="#E3AF64"
              style={{
                opacity: 0,
                animation: "house-glow 1.8s ease-in-out 1.6s infinite",
              }}
            />
            <rect
              x="41"
              y="37"
              width="5"
              height="5"
              rx="0.5"
              fill="#E3AF64"
              style={{
                opacity: 0,
                animation: "house-glow 1.8s ease-in-out 1.7s infinite",
              }}
            />
            {/* Chimney */}
            <path
              d="M44 14 L44 22 L48 22 L48 18"
              stroke="#567375"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              style={{
                strokeDasharray: 30,
                strokeDashoffset: 30,
                animation: "house-draw-chimney 0.5s ease-out 0.6s forwards",
              }}
            />
            {/* Smoke puffs */}
            <circle
              cx="46"
              cy="10"
              r="2"
              fill="#567375"
              style={{
                opacity: 0,
                animation: "house-smoke 2.4s ease-in-out 2s infinite",
              }}
            />
            <circle
              cx="49"
              cy="6"
              r="1.5"
              fill="#567375"
              style={{
                opacity: 0,
                animation: "house-smoke 2.4s ease-in-out 2.4s infinite",
              }}
            />
          </svg>
        </div>

        {/* Label with gentle fade */}
        <span
          className="text-sm font-semibold tracking-wider uppercase text-[#567375]"
          style={{
            animation: "house-fade-in 0.8s ease-in-out 1s forwards",
            opacity: 0,
          }}
        >
          {label}
        </span>
      </div>

      <style>{`
        @keyframes house-draw-roof {
          to { stroke-dashoffset: 0; }
        }
        @keyframes house-draw-walls {
          to { stroke-dashoffset: 0; }
        }
        @keyframes house-draw-door {
          to { stroke-dashoffset: 0; }
        }
        @keyframes house-draw-window {
          to { stroke-dashoffset: 0; }
        }
        @keyframes house-draw-chimney {
          to { stroke-dashoffset: 0; }
        }
        @keyframes house-fade-in {
          to { opacity: 1; }
        }
        @keyframes house-glow {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.4; }
        }
        @keyframes house-smoke {
          0% { opacity: 0; transform: translateY(0) scale(0.8); }
          30% { opacity: 0.3; }
          60% { opacity: 0.15; transform: translateY(-6px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-12px) scale(1.5); }
        }
      `}</style>
    </div>
  );
}
