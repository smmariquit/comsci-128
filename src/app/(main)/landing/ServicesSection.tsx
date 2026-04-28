"use client";

import React, { useState, useEffect, useRef } from "react";
import { House, Search, Users, FileText } from "lucide-react";

// Tokens 
const RUST    = "#b85c28";
const NAVY    = "#1C2632";
const RUST_LT = "#d4784a";
const GOLD    = "#E3AF64";
const CREAM   = "#EAE6DC";
const MONO    = "'IBM Plex Mono', monospace";
const SERIF   = "'Playfair Display', serif";

//  Data 
type Service = { title: string; description: string; icon: React.ReactNode };

const services: Service[] = [
  {
    title: "Dorm Listings",
    icon: <House className="w-8 h-8" strokeWidth={1.5} />,
    description:
      "Browse hundreds of verified dorms, boarding houses, and apartments near UPLB — all with photos, amenities, and verified landlord info.",
  },
  {
    title: "Smart Search",
    icon: <Search className="w-8 h-8" strokeWidth={1.5} />,
    description:
      "Filter by price range, distance from campus, amenities, and room type. Find exactly what fits your budget and lifestyle in seconds.",
  },
  {
    title: "Roommate Finder",
    icon: <Users className="w-8 h-8" strokeWidth={1.5} />,
    description:
      "Match with compatible roommates based on lifestyle, schedule, and budget. Find someone from your course and split the rent.",
  },
  {
    title: "Lease Guide",
    icon: <FileText className="w-8 h-8" strokeWidth={1.5} />,
    description:
      "Understand contracts, tenant rights, and common clauses before you sign. Know what you're agreeing to and move in with confidence.",
  },
];

// Card 
function ServiceCard({
  service,
  index,
  activeCard,
  setActiveCard,
  visible,
}: {
  service: Service;
  index: number;
  activeCard: number | null;
  setActiveCard: (i: number | null) => void;
  visible: boolean;
}) {
  const isActive   = activeCard === index;
  const isInactive = activeCard !== null && !isActive;
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => setActiveCard(isActive ? null : index)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl cursor-pointer overflow-hidden p-6 flex flex-col gap-4 border select-none"
      style={{
        minHeight: "260px",
        // Fade-up on scroll-enter + hover lift 
        transition: "opacity 500ms ease, transform 500ms cubic-bezier(0.34,1.56,0.64,1), background 300ms, border-color 300ms, box-shadow 300ms",
        transitionDelay: visible ? `${index * 110}ms` : "0ms",
        opacity:   visible ? (isInactive ? 0.5 : 1) : 0,
        transform: visible
          ? isActive
            ? "translateY(-6px) scale(1.04)"
            : hovered
            ? "translateY(-6px) scale(1.01)"   //  hover fade-up lift
            : isInactive
            ? "translateY(0) scale(0.97)"
            : "translateY(0) scale(1)"
          : "translateY(32px) scale(0.97)",
        background:  isActive ? RUST : "#243342",
        borderColor: isActive
          ? RUST_LT
          : isInactive
          ? "rgba(255,255,255,0.08)"
          : hovered
          ? "rgba(184,92,40,0.5)"
          : "rgba(194,211,208,0.15)",
        color:     "#f5f2ec",
        boxShadow: isActive
          ? `0 24px 48px rgba(184,92,40,0.35)`
          : hovered
          ? "0 12px 32px rgba(0,0,0,0.3)"
          : "none",
        zIndex: isActive ? 20 : 1,
      }}
    >
      {/* Radial glow on hover */}
      {!isActive && (
        <div
          className="absolute pointer-events-none rounded-full"
          style={{
            left: 0,
            top: "50%",
            width: "200%",
            paddingBottom: "200%",
            transform: `translate(-75%, -50%) scale(${hovered ? 1 : 0})`,
            background: "radial-gradient(circle, rgba(184,92,40,0.22) 0%, transparent 70%)",
            transition: "transform 0.55s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      )}

      {/* Icon + number */}
      <div className="flex items-start justify-between relative z-10">
        <div
          className="p-2.5 rounded-xl transition-colors duration-300"
          style={{
            background: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.10)",
            color:      isActive ? "#fff" : GOLD,
          }}
        >
          {service.icon}
        </div>
        <span
          className="text-4xl font-black tabular-nums"
          style={{
            color:      isActive ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.12)",
            fontFamily: MONO,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-lg font-bold leading-tight relative z-10"
        style={{ color: isActive ? "#fff" : CREAM }}
      >
        {service.title}
      </h3>

      {/* Description (expands when active) */}
      <div
        className="overflow-hidden transition-all duration-500 relative z-10"
        style={{ maxHeight: isActive ? "200px" : "0px", opacity: isActive ? 1 : 0 }}
      >
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
          {service.description}
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-500"
        style={{
          width:      isActive ? "100%" : hovered ? "40%" : "0%",
          background: isActive ? "rgba(255,255,255,0.5)" : RUST_LT,
        }}
      />
    </div>
  );
}

// Section
export default function ServicesSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [visible,    setVisible]    = useState(false);
  const sectionRef                  = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-20 px-8 md:px-20 overflow-hidden"
      style={{
        background: NAVY,
        // Section fade-up on scroll-enter 
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(40px)",
        transition: "opacity 700ms ease, transform 700ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Background blobs */}

      {/* Centre orange glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 55% at 50% 50%, rgba(184,92,40,0.18) 0%, transparent 70%)`,
        }}
      />

      {/* Top-left rust tint */}
      <div
        className="absolute top-0 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: RUST, opacity: 0.06, filter: "blur(80px)" }}
      />
      {/* Bottom-right teal tint */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "#4e7e79", opacity: 0.08, filter: "blur(80px)" }}
      />

      {/* ── Content ── */}
      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <div
          className="mb-12 flex flex-col items-center text-center"
          style={{
            opacity:    visible ? 1 : 0,
            transform:  visible ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 550ms ease 150ms, transform 550ms ease 150ms",
          }}
        >
          <span
            className="text-sm font-semibold tracking-[0.2em] uppercase mb-2"
            style={{ color: "rgba(255,255,255,0.85)", fontFamily: MONO }}
          >
            What we offer
          </span>
          <h2
            className="font-bold leading-tight"
            style={{ fontFamily: SERIF, fontSize: "clamp(2rem, 3vw, 2.8rem)", color: CREAM }}
          >
            Our{" "}
            <em style={{ color: RUST_LT, fontStyle: "italic" }}>Services</em>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, i) => (
            <ServiceCard
              key={i}
              index={i}
              service={service}
              activeCard={activeCard}
              setActiveCard={setActiveCard}
              visible={visible}
            />
          ))}
        </div>

        {/* Hint */}
        <p
          className="mt-10 text-center text-xs tracking-wide"
          style={{
            color:      "rgba(255,255,255,0.2)",
            opacity:    visible ? 1 : 0,
            transition: "opacity 700ms ease 600ms",
          }}
        >
          Click a card to learn more
        </p>
      </div>
    </section>
  );
}