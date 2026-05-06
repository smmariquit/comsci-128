type StateVariant = "empty" | "error";

export default function StateMessage({
  title,
  description,
  variant = "empty",
}: {
  title: string;
  description?: string;
  variant?: StateVariant;
}) {
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`w-full rounded-2xl border px-6 py-8 text-center shadow-sm ${
        isError
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-[#CEC7B0] bg-white text-[#1C2632]"
      }`}
    >
      {/* house illustration */}
      <div className="flex justify-center mb-4">
        {isError ? <ErrorHouse /> : <EmptyHouse />}
      </div>

      <div className="text-lg font-semibold">{title}</div>
      {description && (
        <div
          className={`mt-2 text-sm ${
            isError ? "text-red-700" : "text-[#8AABAC]"
          }`}
        >
          {description}
        </div>
      )}
    </div>
  );
}

/* empty state: calm house with open door, warm window glow */
function EmptyHouse() {
  return (
    <svg
      viewBox="0 0 80 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-[72px]"
      aria-hidden="true"
    >
      {/* roof */}
      <path
        d="M40 8 L70 32 L10 32 Z"
        stroke="#C9642A"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="#C9642A"
        fillOpacity="0.08"
      />
      {/* walls */}
      <rect
        x="16"
        y="32"
        width="48"
        height="30"
        rx="1"
        stroke="#CEC7B0"
        strokeWidth="1.5"
        fill="white"
      />
      {/* door (open/missing — empty inside) */}
      <rect
        x="33"
        y="44"
        width="14"
        height="18"
        rx="1"
        stroke="#CEC7B0"
        strokeWidth="1.5"
        strokeDasharray="3 2"
        fill="none"
      />
      {/* window left */}
      <rect x="21" y="39" width="8" height="8" rx="1" fill="#E3AF64" fillOpacity="0.2" stroke="#E3AF64" strokeWidth="1" />
      <line x1="25" y1="39" x2="25" y2="47" stroke="#E3AF64" strokeWidth="0.5" />
      <line x1="21" y1="43" x2="29" y2="43" stroke="#E3AF64" strokeWidth="0.5" />
      {/* window right */}
      <rect x="51" y="39" width="8" height="8" rx="1" fill="#E3AF64" fillOpacity="0.2" stroke="#E3AF64" strokeWidth="1" />
      <line x1="55" y1="39" x2="55" y2="47" stroke="#E3AF64" strokeWidth="0.5" />
      <line x1="51" y1="43" x2="59" y2="43" stroke="#E3AF64" strokeWidth="0.5" />
      {/* chimney */}
      <rect x="54" y="12" width="5" height="12" rx="0.5" fill="white" stroke="#CEC7B0" strokeWidth="1" />
      {/* ground line */}
      <line x1="4" y1="62" x2="76" y2="62" stroke="#CEC7B0" strokeWidth="1" strokeDasharray="4 3" />
    </svg>
  );
}

/* error state: house with cracks and warning sign */
function ErrorHouse() {
  return (
    <svg
      viewBox="0 0 80 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-20 h-[72px]"
      aria-hidden="true"
    >
      {/* roof */}
      <path
        d="M40 8 L70 32 L10 32 Z"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="#ef4444"
        fillOpacity="0.06"
      />
      {/* walls */}
      <rect
        x="16"
        y="32"
        width="48"
        height="30"
        rx="1"
        stroke="#fca5a5"
        strokeWidth="1.5"
        fill="white"
      />
      {/* door */}
      <rect
        x="33"
        y="44"
        width="14"
        height="18"
        rx="1"
        stroke="#fca5a5"
        strokeWidth="1.5"
        fill="#fef2f2"
      />
      {/* crack on wall */}
      <path
        d="M26 36 L28 42 L25 48 L27 54"
        stroke="#fca5a5"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* window left — X mark */}
      <rect x="21" y="39" width="8" height="8" rx="1" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
      <path d="M23 41 L27 45 M27 41 L23 45" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
      {/* window right — X mark */}
      <rect x="51" y="39" width="8" height="8" rx="1" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1" />
      <path d="M53 41 L57 45 M57 41 L53 45" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
      {/* warning triangle above chimney */}
      <path d="M58 4 L63 13 L53 13 Z" fill="#ef4444" fillOpacity="0.15" stroke="#ef4444" strokeWidth="1" strokeLinejoin="round" />
      <text x="58" y="12" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="bold">!</text>
      {/* chimney */}
      <rect x="54" y="12" width="5" height="12" rx="0.5" fill="white" stroke="#fca5a5" strokeWidth="1" />
      {/* ground line */}
      <line x1="4" y1="62" x2="76" y2="62" stroke="#fca5a5" strokeWidth="1" strokeDasharray="4 3" />
    </svg>
  );
}
