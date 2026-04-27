"use client";

import { useEffect, useState } from "react";

function SeaBackground() {
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

function ShowcaseCards() {
  const data = [
    {
      title: "New Dorm opening at Location X",
      desc: "Men only. 4 pax per unit.",
    },
    {
      title: "Tenants Evicted Due to Pets",
      desc: "Pets were discovered on Apartment X by Landlord A. Following the clause, the tenants who refused to pay the violation fee were evicted",
    },
    {
      title: "New Site for finding Roommates",
      desc: "Learn more about our new site that helps people looking someone to fill in the slots of an apartment.",
    },
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % data.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const current = data[index];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Big Card*/}
      <div className="lg:col-span-2 bg-white rounded-3xl overflow-hidden shadow-xl transition hover:scale-[1.02] flex flex-col h-[420px]">

        {/* Taller image */}
        <div className="h-72 bg-gray-300" />

        {/* Fade content */}
        <div
          key={index}
          className="p-6 animate-fade flex-1 overflow-hidden "
          style={{ backgroundColor: "#567375" }}
        >
          <h3 style={{ color: "#EDE9DE" }} className="text-xl font-bold mb-2">
            {current.title}
          </h3>
          <p style={{ color: "#EDE9DE" }} className="opacity-80 text-sm clamp-4">
            {current.desc}
          </p>
        </div>

      </div>

      {/* Smaller Cards */}
      <div className="flex flex-col gap-6 justify-around">

        {data.map((item, i) => (
          <div
            key={i}
            className={`flex items-stretch rounded-3xl overflow-hidden shadow-xl transition hover:scale-[1.02] ${
              i === index ? "bg-white" : "bg-white/60"
            }`}
          >

            {/* Image */}
            <div className="w-1/3 bg-gray-300 h-full min-h-[100px]" />

            {/* Text */}
            <div
                className="w-2/3 p-4 flex flex-col justify-center"
                style={{ backgroundColor: "#567375" }}
            >
                <h4 style={{ color: "#EDE9DE" }} className="font-semibold mb-1">
                {item.title}
                </h4>

                <p
                style={{ color: "#EDE9DE" }}
                className="text-xs opacity-80 line-clamp-3"
                >
                {item.desc}
                </p>
            </div>

          </div>
        ))}

      </div> 
    </div>
  );
}



export default function ShowcaseSection() {
  return (
    <section className="relative py-20 px-8 md:px-16 overflow-hidden">

      <SeaBackground />

      <div className="relative z-10 max-w-7xl mx-auto">
        <ShowcaseCards />
      </div>

    </section>
  );
}