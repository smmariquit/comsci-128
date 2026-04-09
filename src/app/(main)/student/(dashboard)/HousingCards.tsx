"use client";

import { useState } from "react";
import Image from "next/image";
import DormModal from "./DormModal";
import { getDormDetails } from "./_actions";

export default function HousingCards({ cards }: { cards: any[] }) {
  const [selectedDorm, setSelectedDorm] = useState<any>(null);
  const handleCardClick = async (id: number) => {
    const fullDormData = await getDormDetails(id);
    setSelectedDorm(fullDormData);
};

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
        {cards.map((card) => (
          <div 
            key={card.id} 
            onClick={() => setSelectedDorm(card)}
            className="cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-transform hover:scale-[1.02]"
          >
            <Image
              src="/assets/placeholders/housing-414x264.svg"
              alt={`${card.name} placeholder`}
              width={414}
              height={264}
              className="block h-auto w-full"
            />
            <div className="bg-[#1C2632] px-3.5 py-2.5 text-m font-semibold text-[#C9642A]">
              {card.name}
            </div>
          </div>
        ))}
      </div>

      {/* Render the Modal */}
      {selectedDorm && (
                <DormModal 
                    dorm={selectedDorm} 
                    onClose={() => setSelectedDorm(null)} 
                />
            )}
    </>
  );
}