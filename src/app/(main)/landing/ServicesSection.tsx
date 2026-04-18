"use client";

import { useState } from "react";

type Service = {
  title: string;
  icon: string;
  description: string;
};

export default function ServicesSection() {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const colors = {
    navy: "#1C2632",
    orange: "#C9642A",
  };

  const services: Service[] = [
    {   title: "Contact Us", 
        icon: "/assets/placeholders/avatar-128x128.svg", 
        description: `Wei Wuxian used the Stygian Tiger Tally in Nightless City in his grief. 
        Someone else slumbering in the area made use of the resentment to empower himself all for the sake of revenge. 
        Complicated feelings for Wen Ruohan's white moonlight couldn't help but resurface due to his involvement with the gentry that he wanted to take revenge on. 
        He was also witnessing a reminiscent young love and remembering how… quaint it was. 
        After taking his revenge, what will he do next?` },
    {   title: "Register", 
        icon: "/assets/placeholders/avatar-128x128.svg", 
        description: "Description B" },
    {   title: "About Us", 
        icon: "/assets/placeholders/avatar-128x128.svg", 
        description: "Description C" },
    { title: "Openings", 
        icon: "/assets/placeholders/avatar-128x128.svg", 
        description: "Description D" },
  ];

  return (
    <section
      className="relative py-16 px-8 md:px-20"
      style={{ backgroundColor: colors.navy }}
    >
      <div className="max-w-7xl mx-auto">
        
        <h2 className="text-[var(--cream)] text-2xl font-bold text-center mb-12" 
            style={{ color: "#EDE9DE" }}
        >
          Our Services
        </h2>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, i) => (
            <ServiceCard
              key={i}
              index={i}
              service={service}
              activeCard={activeCard}
              setActiveCard={setActiveCard}
              color={colors.orange}
            />
          ))}          
        </div>
      </div>

    </section>
  );
}

type CardProps = {
  index: number;
  service: Service;
  activeCard: number | null;
  setActiveCard: (i: number | null) => void;
  color: string;
};

function ServiceCard({
  index,
  service,
  activeCard,
  setActiveCard,
  color,
}: CardProps) {
  const isActive = activeCard === index;
  const isInactive = activeCard !== null && activeCard !== index;

  return (
    <div
      onClick={() =>
        setActiveCard(isActive ? null : index)
      }
      className={`
        group relative aspect-[4/5] rounded-2xl cursor-pointer overflow-hidden
        transition-all duration-300 p-4 hover:scale-105
        ${isActive ? "z-20 scale-105 -skew-y-2 shadow-2xl text-[var(--navy)]" : ""}
        ${isInactive ? "opacity-30 scale-95" : ""}
      `}
      style={{ backgroundColor: isActive ? "#EDE9DE" : color }}
    >
      {/* Content wrapper  */}
      <div className={`${isActive ? "skew-y-2" : ""} h-full flex flex-col gap-2`}>
        
        {/* Title */}
        <div className="font-semibold text-xl">
          {service.title}
        </div>

        {/* Description when active */}
        {isActive && (
          <p className="text-sm opacity-70 mt-2 line-clamp-4">
            {service.description}
          </p>
        )}

        {/* Icon */}
        {!isActive && (
            <img
                src={service.icon}
                alt="icon"
                className="absolute bottom-2 left-2 -translate-x-1/3 translate-y-1/3 w-24 h-24 opacity-40 pointer-events-none transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            />
        )}

      </div>
    </div>
  );
}