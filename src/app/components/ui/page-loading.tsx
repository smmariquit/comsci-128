export default function PageLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#EDE9DE]">
      <div className="flex items-center gap-3 text-[#1C2632]">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#C9642A] border-t-transparent" />
        <span className="text-sm font-semibold">{label}...</span>
      </div>
    </div>
  );
}
