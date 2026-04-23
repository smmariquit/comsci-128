export default function Loading() {
  return (
    <main className="min-h-screen text-white flex flex-col items-center p-6">
      <section className="w-full mb-12">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto"
          style={{ animation: "pulse 1.5s ease-in-out infinite" }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              style={{
                background: "#e2dfd6",
                borderRadius: 16,
                height: 220,
              }}
            />
          ))}
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </main>
  );
}
