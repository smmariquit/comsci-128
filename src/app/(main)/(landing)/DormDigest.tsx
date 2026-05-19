import { useState, useEffect, useRef } from "react";
import SeaBackground from "./SeaBackground";

const MONO  = "'IBM Plex Mono', monospace";
const SERIF = "'Playfair Display', serif";

const NEWS = [
  {
    badge: "Featured",
    meta: "Apr 18, 2026 · Housing",
    title: "Tenants Evicted Due to Pets",
    desc: "Pets were discovered on Apartment X by Landlord A. Following the clause, tenants who refused to pay the violation fee were evicted effective immediately.",
    heroBg: `url("assets/images/dormdigest/cats_img.jpg")`,
    side: [
      {
        tag: "New Opening",
        title: "New Dorm at Loyola Heights",
        desc: "Men only, 4 pax per unit. Study rooms and shared kitchen included.",
        bg: `url("/assets/images/dormdigest/dorm_img.jpg")`,
      },
      {
        tag: "Rental",
        title: "Rental Rates Rise for AY 2026–27",
        bg: `url("/assets/images/dormdigest/rent_img.jpg")`,
      },
      {
        tag: "Safety",
        title: "Fire Safety Inspections This Month",
        bg: `url("/assets/images/dormdigest/fire_img.jpg")`,
      },
    ],
  },
  {
    badge: "Rental",
    meta: "Apr 15, 2026 · Finance",
    title: "Rental Rates Rise for AY 2026–27",
    desc: "Landlords across Los Baños have announced updated rates averaging 8–12% higher across all unit types for the upcoming academic year.",
    heroBg: `url("/assets/images/dormdigest/rent_img.jpg")`,
    side: [
      {
        tag: "Featured",
        title: "Tenants Evicted Due to Pets",
        desc: "Pets found on Apartment X; tenants evicted after refusing violation fee payment.",
        bg: `url("/assets/images/dormdigest/cats_img.jpg")`,
      },
      {
        tag: "Safety",
        title: "Fire Safety Inspections Begin Apr 20",
        bg: `url("/assets/images/dormdigest/fire_img.jpg")`,
      },
      {
        tag: "New Opening",
        title: "Loyola Heights Dorm Opens This Sem",
        bg: `url("/assets/images/dormdigest/dorm_img.jpg")`,
      },
    ],
  },
  {
    badge: "Dorm Opening",
    meta: "Apr 10, 2026 · New Opening",
    title: "Loyola Heights Dorm Opens This Sem",
    desc: "There is a new dorm opening in Loyola Heights. Find your new dorm near campus. Create a profile, set preferences, and match with potential housemates.",
    heroBg: `url("/assets/images/dormdigest/dorm_img.jpg")`,
    side: [
      {
        tag: "Rental",
        title: "Rental Rates Rise for AY 2026–27",
        desc: "Average 8–12% increase announced by Los Baños landlords for next year.",
        bg: `url("/assets/images/dormdigest/rent_img.jpg")`,
      },
      {
        tag: "Featured",
        title: "Tenants Evicted Due to Pets",
        bg: `url("/assets/images/dormdigest/cats_img.jpg")`,
      },
      {
        tag: "Safety",
        title: "Compliance Deadline for Fire Inspections",
        bg: `url("/assets/images/dormdigest/fire_img.jpg")`,
      },
    ],
  },
  {
    badge: "Safety",
    meta: "Apr 8, 2026 · Notice",
    title: "Fire Safety Inspections This Month",
    desc: "The UPLB Housing Office reminds all dorm operators to comply with annual fire safety inspections. Non-compliant establishments face temporary closure orders.",
    heroBg: `url("/assets/images/dormdigest/fire_img.jpg")`,
    side: [
      {
        tag: "New Opening",
        title: "Loyola Heights Dorm Opens This Sem",
        desc: "There is a new dorm opening in Loyola Heights for Men.",
        bg: `url("/assets/images/dormdigest/dorm_img.jpg")`,
      },
      {
        tag: "Rental",
        title: "Rental Rates Rise for AY 2026–27",
        bg: `url("/assets/images/dormdigest/rent_img.jpg")`,
      },
      {
        tag: "Featured",
        title: "Tenants Evicted Due to Pets",
        bg: `url("/assets/images/dormdigest/cats_img.jpg")`,
      },
    ],
  },
];

    const imgStyle = (bg: string) => ({
    backgroundImage: `url(${bg})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    });

    export default function DormDigest() {
    const [cur, setCur] = useState(0);
    const [pct, setPct] = useState(0);
    const ivRef = useRef<NodeJS.Timeout | null>(null);

    const startInterval = (startCur: number) => {
        if (ivRef.current) clearInterval(ivRef.current);

        let localPct = 0;
        let localCur = startCur;

        ivRef.current = setInterval(() => {
        localPct++;
        setPct(localPct);

        if (localPct >= 100) {
            localCur = (localCur + 1) % NEWS.length;
            localPct = 0;
            setCur(localCur);
            setPct(0);
        }
        }, 60);
    };

    useEffect(() => {
        startInterval(cur);
        return () => {
        if (ivRef.current) clearInterval(ivRef.current);
        };
    }, []);

    const goTo = (idx: number) => {
        if (ivRef.current) clearInterval(ivRef.current);
        setCur(idx);
        setPct(0);
        startInterval(idx);
    };

    const n = NEWS[cur];

  return (
    <section className="relative overflow-hidden bg-[#EAE6DC] px-12 py-20" id="news">
        <SeaBackground />
        
      {/* Header  */}
      <div className="relative z-10 mb-9 flex items-baseline justify-between">
        <h2 style={{ fontFamily: SERIF, fontSize: "clamp(2rem, 3.5vw, 2.5rem)", color: "#0d1b2a", fontWeight: 700 }}>
          Dorm{" "}
          <em style={{ color: "#b85c28", fontStyle: "italic", fontWeight: 600 }}>Digest</em>
        </h2>
      </div>

      {/* News Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-[1.1rem] grid-rows-[auto_auto]">

        {/* Hero Card */}
        <div className="col-1 row-[1/3] flex cursor-pointer flex-col overflow-hidden rounded-[18px] shadow-[0_8px_32px_rgba(13,27,42,.18)] transition-transform hover:scale-[1.013]">
          <div className="relative min-h-57.5 flex-1 overflow-hidden">
            {/* image */}
            <div className="absolute inset-0 transition-transform duration-400 hover:scale-105" style={imgStyle(n.heroBg)} />
            {/* dim overlay */}
            <div className="absolute inset-0 bg-black/40" />
            {/* badge — above the overlay */}
            <span
              style={{ fontFamily: MONO, fontSize: "1rem", letterSpacing: "0.12em" }}
              className="absolute top-3.5 left-3.5 z-10 rounded-[20px] bg-[#b85c28] px-2.75 py-1 uppercase text-white"
            >
              {n.badge}
            </span>
          </div>
          <div className="bg-[#2e4a50] px-[1.4rem] py-[1.3rem]">
            <p style={{ fontFamily: MONO, fontSize: "0.9rem", letterSpacing: "0.05em" }}
               className="mb-[.45rem] text-[#c2d3d0] opacity-65">
              {n.meta}
            </p>
            <h3 style={{ fontFamily: SERIF, fontSize: "1.6rem", lineHeight: 1.3 }}
                className="mb-[.55rem] text-[#e8f0ee] font-bold tracking-wide">
              {n.title}
            </h3>
            <p style={{ fontFamily: MONO, fontSize: "0.9rem", lineHeight: 1.7 }}
               className="line-clamp-3 text-[#c2d3d0] opacity-[.82]">
              {n.desc}
            </p>
          </div>
        </div>

        {/* Wide Card */}
        <div className="col-2 row-1 flex min-h-40.5 cursor-pointer overflow-hidden rounded-[14px] bg-white shadow-[0_6px_24px_rgba(13,27,42,.14)] transition-transform hover:-translate-y-0.75">
          <div className="relative w-26.25 shrink-0 overflow-hidden">
            {/* image */}
            <div className="absolute inset-0 transition-transform duration-350 hover:scale-105" style={imgStyle(n.side[0].bg)} />
            {/* dim overlay */}
            <div className="absolute inset-0 bg-black/25" />
          </div>
          <div className="flex flex-1 flex-col justify-center px-[1.1rem] py-[.9rem]">
            <p style={{ fontFamily: MONO, fontSize: "0.9rem", letterSpacing: "0.12em" }}
               className="mb-[0.9rem] uppercase text-[#C9642A]">
              {n.side[0].tag}
            </p>
            <h4 style={{ fontFamily: SERIF, fontSize: "1.5rem", lineHeight: 1.3 }}
                className="mb-[.3rem] text-[#0d1b2a] font-bold tracking-wide">
              {n.side[0].title}
            </h4>
            {n.side[0].desc && (
              <p style={{ fontFamily: MONO, fontSize: "0.9rem", lineHeight: 1.6 }}
                 className="line-clamp-2 text-[#5a6a68]">
                {n.side[0].desc}
              </p>
            )}
          </div>
        </div>

        {/* Mini Cards */}
        <div className="col-2 row-2 grid grid-cols-2 gap-[.9rem]">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-[0_4px_18px_rgba(13,27,42,.13)] transition-transform hover:-translate-y-0.75"
            >
              <div className="relative h-20.5 overflow-hidden">
                {/* image */}
                <div className="absolute inset-0 transition-transform duration-350 hover:scale-105" style={imgStyle(n.side[i].bg)} />
                {/* dim overlay */}
                <div className="absolute inset-0 bg-black/25" />
              </div>
              <div className="flex-1 px-[.9rem] py-3">
                <p style={{ fontFamily: MONO, fontSize: "1rem", letterSpacing: "0.1em" }}
                   className="mb-[.2rem] mt-2 uppercase text-[#C9642A]">
                  {n.side[i].tag}
                </p>
                <h5 style={{ fontFamily: SERIF, fontSize: "0.9rem", lineHeight: 1.3 }}
                    className="text-[#0d1b2a] font-bold tracking-wide">
                  {n.side[i].title}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Dots */}
      <div className="relative z-10 mt-[1.1rem] flex items-center gap-[.55rem]">
        {NEWS.map((_, i) => {
          const isActive = i === cur;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="h-2 rounded-[3px] transition-all duration-300"
              style={{
                width: isActive ? "25px" : "10px",
                background: isActive
                  ? `linear-gradient(90deg,#b85c28 ${pct}%,#c2d3d0 ${pct}%)`
                  : "#c2d3d0",
              }}
              aria-label={`Go to story ${i + 1}`}
            />
          );
        })}
        <span
          style={{ fontFamily: MONO, fontSize: "0.9rem", letterSpacing: "0.05em" }}
          className="ml-auto text-[#4e7e79] opacity-55"
        >
          auto-advancing
        </span>
      </div>
    </section>
  );
}