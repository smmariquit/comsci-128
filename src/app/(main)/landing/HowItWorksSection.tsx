"use client";

import { useEffect, useRef, useState } from "react";
import { floatingAnimations } from "./animations"; 

// Data 
const STEPS = [
  {
    num: "01",
    title: "Create your account",
    desc: "Sign up with your UPLB email in under a minute. No fees, no hassle.",
  },
  {
    num: "02",
    title: "Browse & filter listings",
    desc: "Use smart filters — price range, distance from campus, amenities, and more.",
  },
  {
    num: "03",
    title: "Contact the landlord",
    desc: "Message verified landlords directly through the platform. No middleman.",
  },
  {
    num: "04",
    title: "Move in with confidence",
    desc: "Review the lease guide, understand your rights, and move in safely.",
  },
];

// Component 
export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [visible,    setVisible]    = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll reveal
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Step auto-cycle animation
  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STEPS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Inject keyframes from animations.ts */}
      <style>{floatingAnimations}</style>

      <section
        ref={sectionRef}
        id="how"
        className="relative overflow-hidden md:px-20 py-20 bg-[#263f44]"
      >
        {/* Radial rust glow — left side */}
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(ellipse_40%_60%_at_20%_50%,rgba(184,92,40,.12)_0%,transparent_65%)]" />

        {/* Section header */}
        <div
          className="flex items-end justify-between relative z-10 transition-all duration-650 ease-in-out"
          style={{
            opacity:   visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
          }}
        >
          <div>
            <p className="text-[15px] tracking-[.15em] uppercase mb-2 text-[rgba(194,211,208,.55)]">
              Getting started
            </p>
            <h2 className="leading-tight text-[clamp(2rem,5vw,3rem)] text-[#f5f2ec] font-['Playfair_Display',serif]">
              How It{" "}
              <em className="text-[#d4784a] italic">Works</em>
            </h2>
          </div>
        </div>

        {/* Two-column grid */}
        <div
          className="grid grid-cols-2 gap-16 items-center relative z-10 transition-all duration-650 ease-in-out" // transition to scroll
          style={{
            opacity:   visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(22px)",
          }}
        >
          {/* Left: Steps */}
          <div className="flex flex-col gap-6 mt-2">
            {STEPS.map((step, i) => {
              const isActive = activeStep === i;
              return (
                <div
                  key={step.num}
                  className="flex gap-5 items-start cursor-default transition-opacity duration-300"
                  style={{ opacity: isActive ? 1 : 0.5 }}
                >
                  {/* Number circle */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs transition-all duration-300 font-['IBM_Plex_Mono',monospace]"
                    style={{
                      border:     isActive ? "1.5px solid #b85c28" : "1.5px solid rgba(194,211,208,.3)",
                      background: isActive ? "#b85c28" : "transparent",
                      color:      isActive ? "#fff" : "rgba(194,211,208,.8)",
                    }}
                  >
                    {step.num}
                  </div>

                  {/* Body */}
                  <div>
                    <h4 className="mb-1 leading-snug text-[1.45rem] text-[#f5f2ec] font-['Playfair_Display',serif]">
                      {step.title}
                    </h4>
                    <p className="leading-relaxed text-[.85rem] text-[rgba(194,211,208,.7)] font-['IBM_Plex_Mono',monospace]">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Card visual */}
          <div className="relative" style={{ height: "380px" }}>

            {/* Main card - 1 */}
            <div className="absolute float-updown w-70 top-25 left-80 z-10 rounded-2xl bg-white/10 border border-[rgba(194,211,208,.18)] p-[1.4rem] shadow-[0_8px_32px_rgba(13,27,42,.25)]">

              {/* Verified tag */}
              <p className="mb-2.5 text-[.65rem] tracking-[.12em] uppercase text-[rgba(194,211,208,.65)] font-['IBM_Plex_Mono',monospace]">
                Verified · Available Slots Now!
              </p>

              {/* Title */}
              <p className="text-[1rem] text-[#f5f2ec] leading-[1.3] mb-2 font-['Playfair_Display',serif]">
                Moses Boarding House
                <br />
                Onyx St. — Umali Subdivision
              </p>

              {/* Amenity pills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {["WiFi", "Aircon", "Laundry", "Duo"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[.6rem] px-2 py-0.5 rounded-lg bg-[rgba(184,92,40,.25)] text-[#d4784a] font-['IBM_Plex_Mono',monospace]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Price */}
              <p className="text-[1.1rem] text-[#f5f2ec] mt-4 font-['Playfair_Display',serif]">
                ₱4,000{" "}
                <span className="text-[.7rem] text-[rgba(194,211,208,.65)] font-['IBM_Plex_Mono',monospace]">
                  / month
                </span>
              </p>
            </div>

            {/* Main card - 2 */}
            <div className="absolute float-updown w-70 left-5 z-10 rounded-2xl bg-white/10 border border-[rgba(194,211,208,.18)] p-[1.4rem] shadow-[0_8px_32px_rgba(13,27,42,.25)]">

              {/* Verified tag */}
              <p className="mb-2.5 text-[.65rem] tracking-[.12em] uppercase text-[rgba(194,211,208,.65)] font-['IBM_Plex_Mono',monospace]">
                Verified · Available Slots Now!
              </p>

              {/* Title */}
              <p className="text-[1rem] text-[#f5f2ec] leading-[1.3] mb-2 font-['Playfair_Display',serif]">
                Peach Boarding House
                <br />
                Pearl St. — Umali Subdivision
              </p>

              {/* Amenity pills */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {["WiFi", "Aircon", "Laundry", "Solo"].map((tag) => (
                  <span
                    key={tag}
                    className="text-[.6rem] px-2 py-0.5 rounded-lg bg-[rgba(184,92,40,.25)] text-[#d4784a] font-['IBM_Plex_Mono',monospace]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Price */}
              <p className="text-[1.1rem] text-[#f5f2ec] mt-4 font-['Playfair_Display',serif]">
                ₱3,300{" "}
                <span className="text-[.7rem] text-[rgba(194,211,208,.65)] font-['IBM_Plex_Mono',monospace]">
                  / month
                </span>
              </p>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}