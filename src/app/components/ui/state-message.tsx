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
