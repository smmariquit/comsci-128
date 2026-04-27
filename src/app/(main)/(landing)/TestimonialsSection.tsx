"use client";

import { useRef, useEffect } from "react";

const testimonials = [
  {
    quote: "Found my dorm in literally two days! Filters made it so easy to find something near my college and within my allowance.",
    name: "Luthelle Fernandez",
    course: "BS Computer Science, 3rd Year",
    initials: "LF",
    avatar: "bg-[#1C2632]",
  },
  {
    quote: "Got a perfect dorm for me. I had someone from my course as roommate — we've been living together for two semesters now.",
    name: "Justine Ivanne Antonio",
    course: "BS Computer Science, 3rd Year",
    initials: "JA",
    avatar: "bg-[#C9642A]",
  },
  {
    quote: "Didn't expect it to be this easy. Found a great dorm near campus in no time.",
    name: "Paul Hadley Fababeir",
    course: "BS Computer Science, 3rd Year",
    initials: "PF",
    avatar: "bg-[#567375]",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setTimeout(() => {
          if (headerRef.current) {
            headerRef.current.classList.remove("opacity-0", "translate-y-4");
            headerRef.current.classList.add("fade-up");
          }
        }, 60);

        cardRefs.current.forEach((card, i) => {
          setTimeout(() => {
            if (card) {
              card.classList.remove("opacity-0", "translate-y-4");
              card.classList.add("fade-up");
            }
          }, 200 + i * 130);
        });

        observer.disconnect();
      },
      { threshold: 0.05 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    const failsafe = setTimeout(() => {
      headerRef.current?.classList.remove("opacity-0");
      cardRefs.current.forEach((card) => card?.classList.remove("opacity-0"));
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="bg-[#EDE9DE] py-20 px-8 md:px-20 overflow-hidden"
    >
      {/* Header */}
      <div ref={headerRef} className="mb-12 opacity-0 max-w-xl">
        <p
          className="text-xs font-semibold tracking-[0.2em] uppercase text-[#567375] mb-2"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Student Stories
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold text-[#1C2632] leading-tight"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          What{" "}
          <em className="text-[#C9642A] italic">Works</em>
          {" "}Says
        </h2>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div
            key={i}
            ref={(el) => { cardRefs.current[i] = el; }}
            className="opacity-0 bg-white rounded-2xl p-6 flex flex-col gap-6 border border-black/5 transition-transform duration-300 ease-out hover:-translate-y-2 hover:shadow-lg"
          >
            {/* Quote mark */}
            <span className="text-2xl font-black text-[#567375]" style={{ fontFamily: "'Playfair Display', serif" }}>
              "
            </span>

            {/* Quote text */}
            <p className="text-sm leading-relaxed text-[#1C2632]/70 flex-1" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              {t.quote}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-2 border-t border-black/5">
              <div
                className={`w-9 h-9 rounded-full ${t.avatar} flex items-center justify-center shrink-0`}
              >
                <span className="text-xs font-bold text-white">
                  {t.initials}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1C2632]"> {t.name} </p>
                <p className="text-xs text-[#1C2632]/50" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                  {t.course}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}