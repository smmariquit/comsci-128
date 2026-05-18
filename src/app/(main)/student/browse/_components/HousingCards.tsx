"use client";

import { useState } from "react";
import Image from "next/image";
import DormModal from "./DormModal";
import { getDormDetails } from "../_actions";

export default function HousingCards({ cards }: { cards: any[] }) {
  const [selectedDorm, setSelectedDorm] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);

  const handleCardClick = async (id: number) => {
    setIsFetching(true);
    try {
      const data = await getDormDetails(id);
      if (data) {
        setSelectedDorm({
          id: data.housing_id,
          name: data.housing_name,
          address: data.housing_address,
          housing_type: data.housing_type,
          price: data.rent_price,
          image: data.housing_image,
          appli_start: data.start_application_date
            ? new Date(data.start_application_date).toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                },
              )
            : "TBA",
          appli_end: data.end_application_date
            ? new Date(data.end_application_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "TBA",
        });
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <>
      {isFetching && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20" aria-live="polite" aria-label="Loading housing details">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#8b3e15]"></div>
        </div>
      )}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {cards.map((card) => ( 
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick(card.id);
              }
            }}
            type="button"
            aria-label={`Open details for ${card.name}`}
            className="flex flex-col cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-transform hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-[#8b3e15] focus-visible:outline-none focus-visible:ring-offset-2 text-left"
          >
            <Image
              src={
                card.image || "/assets/placeholders/housing-414x264.svg"
              }
              alt={card.name}
              width={414}
              height={264}
              className="block h-auto w-full"
            />
            <div className="flex-1 bg-[#1C2632] px-3.5 py-3 flex flex-col gap-1.5 font-[family-name:var(--font-geist-sans)]">
              <div className="text-sm font-bold text-[#f7e3d7] truncate">
                {card.name}
              </div>
              <div className="flex justify-between items-center text-xs text-white/90">
                <span className="bg-white/15 px-2 py-0.5 rounded-full text-white/90">
                  {card.type}
                </span>
                <span className="font-semibold text-white/90">
                  ₱{card.price}/mo
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Render the Modal */}
      {selectedDorm && (
        <DormModal dorm={selectedDorm} onClose={() => setSelectedDorm(null)} />
      )}
    </>
  );
}
