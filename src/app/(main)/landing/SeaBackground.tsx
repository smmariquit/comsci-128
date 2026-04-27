"use client";

import { useEffect, useState } from "react";

export default function SeaBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden z-0">

      {/* Blue Circles */}
      {[...Array(14)].map((_, i) => {
        const size = Math.random() * 80 + 40;

        return (
          <div
            key={`blue-${i}`}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "9999px",
              backgroundColor: "#567375",
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
              animation: `floatSea ${Math.random() * 12 + 10}s linear infinite`,
              opacity: Math.random() * 0.2 + 0.3,
            }}
          />
        );
      })}

      {/* Gold Circles */}
      {[...Array(6)].map((_, i) => {
        const size = Math.random() * 60 + 20;

        return (
          <div
            key={`gold-${i}`}
            style={{
              position: "absolute",
              width: size,
              height: size,
              borderRadius: "9999px",
              backgroundColor: "#E3AF64",
              left: `${Math.random() * 100}%`,
              bottom: `${Math.random() * 100}%`,
              animation: `floatSea ${Math.random() * 14 + 12}s linear infinite`,
              opacity: Math.random() * 0.15 + 0.1,
            }}
          />
        );
      })}

    </div>
  );
}