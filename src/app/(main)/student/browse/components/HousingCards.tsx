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
                    appli_start: data.start_application_date 
                        ? new Date(data.start_application_date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                        }) 
                        : "TBA",
                    appli_end: data.end_application_date 
                        ? new Date(data.end_application_date).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#C9642A]"></div>
                </div>
        )}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
            {cards.map((card) => (
            <div 
                key={card.id} 
                onClick={() => handleCardClick(card.id)}
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