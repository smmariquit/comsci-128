"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          if (contentRef.current) {
            contentRef.current.classList.remove("opacity-0");
            contentRef.current.classList.add("fade-up");
          }
        }, 60);
        observer.disconnect();
      },
      { threshold: 0.05 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    const failsafe = setTimeout(() => {
      contentRef.current?.classList.remove("opacity-0");
    }, 1500);

    return () => {
      observer.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="cta"
      className="bg-[#C9642A] py-14 px-8 md:px-20"
    >
      <div
        ref={contentRef}
        className="opacity-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        {/* Text */}
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight font-['DM_Serif_Display']">
            Ready to find your <br />
            home away from home?
          </h2>
          <p className="text-sm text-white/70 font-['Chivo_Mono'] tracking-wider">
            Join over 1,200 students who found their dorm through CASA.
          </p>
        </div>

        {/* Button */}
        <Link
          href="/register"
          className="shrink-0 bg-white text-[#C9642A] text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#EDE9DE] transition-colors duration-200 whitespace-nowrap"
        >
          Get Started Free
        </Link>
      </div>
    </section>
  );
}
