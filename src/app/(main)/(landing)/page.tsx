"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { floatingAnimations } from "./animations";
import CTASection from "./GSSection";
import HowItWorks from "./HowItWorksSection";
import ServicesSection from "./ServicesSection";
import TestimonialsSection from "./TestimonialsSection";

// Mapping colors
const colors = {
  cream: "#EDE9DE",
  navy: "#1C2632",
  orange: "#C9642A",
  gold: "#E3AF64",
  light_blue: "#567375",
};

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = document.cookie.includes("is_logged_in=true");
      setIsLoggedIn(isAuth);

      const match = document.cookie
        .split("; ")
        .find((c) => c.startsWith("user_role="));
      if (match) {
        setUserRole(match.split("=")[1]);
      }
    };
    checkAuth();
  }, []);

  const getDashboardRoute = () => {
    if (userRole === "student") return "/student";
    if (userRole === "system admin" || userRole === "admin") return "/sys";
    if (userRole === "housing administrator" || userRole === "house admin")
      return "/admin";
    if (userRole === "manager") return "/manage";
    return "/student";
  };

  return (
    <div className="min-h-screen font-family-name:var(--font-geist-sans) bg-[#EDE9DE] text-[#1C2632]">
      {/*animation for circles*/}
      <style>{floatingAnimations}</style>

      {/* ── Navbar ── */}
      <nav className="flex justify-between items-center px-8 py-6 md:px-16">
        <div className="font-bold text-xl tracking-tight">UPLB CASA</div>
        <div className="flex items-center gap-5">
          {isLoggedIn ? (
            <Link
              href={getDashboardRoute()}
              className="bg-[#C9642A] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#b5561f] transition-colors shadow-sm shadow-[#C9642A]/30"
            >
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="font-semibold text-[#C9642A] hover:bg-[#C9642A]/10 px-4 py-2.5 rounded-xl transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="bg-[#C9642A] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#b5561f] transition-colors shadow-sm shadow-[#C9642A]/30"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-[75vh] flex items-start pt-16 px-12 md:px-24 pb-8 overflow-hidden">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#1C2632 1px, transparent 1px), linear-gradient(90deg, #1C2632 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="w-full flex flex-col md:flex-row justify-between items-start gap-16 relative z-10 -mt-5">
          {/* Text */}
          <div className="max-w-xl text-left">
            <p className="fade-up text-xs font-semibold tracking-[0.18em] uppercase text-[#567375] mb-4">
              Student Housing Portal
            </p>

            <h1 className="fade-up text-6xl md:text-8xl font-black mb-6 tracking-tight leading-[0.95] text-[#1C2632]">
              Welcome,{" "}
              <span className="text-[#567375] relative">
                Isko
                {/* underline accent */}
                <span className="absolute -bottom-1 left-0 w-full h-0.75 rounded-full bg-[#E3AF64]/60" />
              </span>
            </h1>

            <p className="pt-4 fade-up-delay text-sm leading-relaxed max-w-md font-(family-name:--font-geist-mono) text-[#111820]">
              Explore a wide range of verified dorms, apartments, and boarding
              houses near UPLB — helping students find secure, comfortable, and
              affordable housing with ease.
            </p>

            {/* CTA + Scroll Section */}
            <div className="flex flex-col items-start mt-8">
              {/* CTA buttons */}
              <div className="fade-up-delay flex items-start gap-3">
                <Link
                  href="/login"
                  className="bg-[#1C2632] text-[#EDE9DE] px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#243040] transition-colors shadow-md"
                >
                  Find a Dorm
                </Link>
                <Link
                  href="#services"
                  className="border border-[#1C2632]/20 text-[#1C2632] px-6 py-3 rounded-xl font-semibold text-sm hover:border-[#C9642A] hover:text-[#C9642A] transition-colors"
                >
                  Learn More
                </Link>
              </div>

              {/* Project & Beta Testing Links */}
              <div className="fade-up-delay mt-4 text-xs text-[#567375] flex items-center gap-2 font-mono">
                <span>Project:</span>
                <a
                  href="https://github.com/smmariquit/comsci-128"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#C9642A] transition-colors"
                >
                  GitHub
                </a>
                <span>&bull;</span>
                <a
                  href="https://github.com/smmariquit/comsci-128/blob/main/betaTesting.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#C9642A] transition-colors"
                >
                  Beta Testing Guide
                </a>
              </div>

              {/* Scroll to explore */}
              <div className="flex items-center gap-3 mt-5 animate-float">
                {/* Mouse icon */}
                <div className="w-6 h-8 border-2 border-[#1a2332] rounded-full flex justify-center pt-1">
                  <div className="w-1.5 h-1.5 bg-[#1a2332] rounded-full animate-scroll-dot"></div>
                </div>

                <p className="text-sm text-[#111820] font-(--font-geist-mono)">
                  Scroll to explore
                </p>
              </div>
            </div>
          </div>

          {/* Decorative Circles Container */}
          <div className="hidden md:block relative w-md h-112 self-center">
            {/* Front Circle */}
            <div
              className="float-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 right-auto w-92 h-92 border rounded-full"
              style={{ borderColor: colors.light_blue }}
            />

            {/* Back Circle */}
            <div
              className="float-slow-alt absolute top-[60%] left-[25%] -translate-x-1/2 -translate-y-1/2 right-auto w-72 h-72 rounded-full opacity-60 blur-[2px] floatSlowAlt"
              style={{ backgroundColor: colors.gold }}
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <ServicesSection />

      {/* How it works section */}
      <HowItWorks />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Get Started with orange section */}
      <CTASection />

      {/* ── Footer ── */}
      <footer className="bg-[#1C2632] text-[#EDE9DE] py-12 px-8 md:px-16 border-t border-[#EDE9DE]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 text-center md:text-left">
            <h3 className="font-bold text-lg tracking-tight">UPLB CASA</h3>
            <p className="text-xs text-[#EDE9DE]/60 max-w-sm">
              Centralized Accommodation System Application. Helping UPLB students find secure, comfortable, and affordable housing with ease.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/smmariquit/comsci-128"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#EDE9DE]/80 hover:text-[#E3AF64] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <span className="text-[#EDE9DE]/30">|</span>
            <a
              href="https://github.com/smmariquit/comsci-128/blob/main/betaTesting.md"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[#EDE9DE]/80 hover:text-[#E3AF64] transition-colors"
            >
              <span>Beta Testing Guide</span>
            </a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-[#EDE9DE]/10 text-center text-xs text-[#EDE9DE]/40">
          &copy; {new Date().getFullYear()} UPLB CASA. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
