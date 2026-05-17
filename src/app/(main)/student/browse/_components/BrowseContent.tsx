"use client";

import { useState, useCallback, type ReactNode } from "react";
import Image from "next/image";
import HousingMap, { type HousingMarker } from "@/app/components/map/HousingMap";
import DormModal from "./DormModal";
import { getDormDetails } from "../_actions";
import { Map, LayoutGrid } from "lucide-react";

/* ────────────────────── Types ────────────────────── */

interface HousingCard {
  id: number;
  name: string;
  type: string;
  price: number | string;
  image?: string | null;
  lat: number | null;
  lng: number | null;
}

interface BrowseContentProps {
  cards: HousingCard[];
  searchBar: ReactNode;
  emptyState: ReactNode | null;
}

/* ────────────────────── Component ────────────────────── */

export default function BrowseContent({
  cards,
  searchBar,
  emptyState,
}: BrowseContentProps) {
  const [selectedDorm, setSelectedDorm] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  // Build map markers from real DB coordinates
  const markers: HousingMarker[] = cards
    .filter((card) => card.lat !== null && card.lng !== null)
    .map((card) => ({
      id: card.id,
      name: card.name,
      type: card.type,
      price: card.price,
      lat: card.lat!,
      lng: card.lng!,
      image: card.image,
    }));

  const handleCardClick = useCallback(async (id: number) => {
    setSelectedCardId(id);
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
                { month: "long", day: "numeric", year: "numeric" }
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
  }, []);

  const handleMarkerClick = useCallback(
    (id: number) => {
      setSelectedCardId(id);
      handleCardClick(id);
    },
    [handleCardClick]
  );

  return (
    <>
      {/* Fetching overlay */}
      {isFetching && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#C9642A]" />
        </div>
      )}

      <div className={`browse-root ${showMap ? "map-visible" : "map-hidden"}`}>
        {/* ── Left: Map ── */}
        {showMap && (
          <div className="browse-map-panel">
            <HousingMap
              housings={markers}
              selectedId={selectedCardId}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        )}

        {/* ── Right: Search + Cards ── */}
        <div className="browse-content-panel">
          {/* Search bar + toggle */}
          <div className="browse-toolbar">
            <div className="browse-search-area">{searchBar}</div>
            <button
              onClick={() => setShowMap(!showMap)}
              className="browse-toggle-btn"
              id="toggle-map-view"
            >
              {showMap ? (
                <>
                  <LayoutGrid size={16} />
                  <span className="hidden sm:inline">Cards Only</span>
                </>
              ) : (
                <>
                  <Map size={16} />
                  <span className="hidden sm:inline">Show Map</span>
                </>
              )}
            </button>
          </div>

          {/* Scrollable cards area */}
          <div className="browse-cards-scroll">
            {emptyState ? (
              <div className="p-6">{emptyState}</div>
            ) : (
              <div className="browse-cards-grid">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className={`flex flex-col cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md
                      ${selectedCardId === card.id ? "ring-2 ring-[#C9642A] ring-offset-2 scale-[1.01]" : ""}`}
                  >
                    <div className="relative w-full" style={{ aspectRatio: '16/10' }}>
                      <Image
                        src={
                          card.image ||
                          "/assets/placeholders/housing-414x264.svg"
                        }
                        alt={card.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 bg-[#1C2632] px-3.5 py-3 flex flex-col gap-1.5 font-[family-name:var(--font-geist-sans)]">
                      <div className="text-sm font-bold text-[#C9642A] truncate">
                        {card.name}
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-white/60">
                        <span className="bg-white/10 px-2 py-0.5 rounded-full">
                          {card.type}
                        </span>
                        <span className="font-semibold text-white/90">
                          ₱{card.price}/mo
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedDorm && (
        <DormModal dorm={selectedDorm} onClose={() => setSelectedDorm(null)} />
      )}

      <style>{`
        /* ═══════════════════════════════════════
           ROOT LAYOUT
           ═══════════════════════════════════════ */

        .browse-root {
          width: 100%;
          flex: 1;
          background: #EDE9DE;
        }

        /* ═══════════════════════════════════════
           MAP PANEL
           ═══════════════════════════════════════ */

        .browse-map-panel {
          width: 100%;
          height: 45vh;
          min-height: 280px;
          position: relative;
        }

        /* ═══════════════════════════════════════
           CONTENT PANEL (Search + Cards)
           ═══════════════════════════════════════ */

        .browse-content-panel {
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        /* ─── Toolbar: search + toggle ─── */
        .browse-toolbar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #EDE9DE;
        }

        .browse-search-area {
          flex: 1;
          min-width: 0;
        }

        .browse-search-area > div {
          width: 100% !important;
          margin: 0 !important;
          padding: 0.5rem 0 !important;
        }

        .browse-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          border: none;
          background: #1C2632;
          color: white;
          font-size: 0.8125rem;
          font-weight: 600;
          font-family: var(--font-geist-sans), sans-serif;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.15s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          min-height: 2.5rem;
          min-width: 2.5rem;
          flex-shrink: 0;
        }

        .browse-toggle-btn:hover {
          background: #2a3a4e;
        }

        .browse-toggle-btn:active {
          transform: scale(0.95);
        }

        /* ─── Scrollable cards ─── */
        .browse-cards-scroll {
          flex: 1;
          overflow-y: auto;
          padding: 0.75rem 1rem 2rem;
        }

        .browse-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 0.75rem;
        }

        /* ═══════════════════════════════════════
           DESKTOP: Both panels locked to viewport
           ═══════════════════════════════════════ */

        @media (min-width: 1024px) {
          .browse-root.map-visible {
            display: flex;
            flex-direction: row;
            height: calc(100vh - 5.5rem);
            overflow: hidden;
          }

          .browse-map-panel {
            width: 50%;
            height: 100%;
            flex-shrink: 0;
          }

          .browse-content-panel {
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .browse-cards-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 1rem 1.5rem 2rem;
          }

          .browse-cards-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 0.75rem;
          }

          .browse-cards-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .browse-cards-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .browse-cards-scroll::-webkit-scrollbar-thumb {
            background: rgba(28, 38, 50, 0.15);
            border-radius: 3px;
          }
          .browse-cards-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(28, 38, 50, 0.3);
          }

          .browse-toolbar {
            padding: 0.5rem 1.5rem;
          }
        }

        @media (min-width: 1440px) {
          .browse-map-panel {
            width: 55%;
          }

          .browse-root.map-visible .browse-content-panel {
            width: 45%;
          }

          .browse-cards-grid {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          }
        }

        /* ═══════════════════════════════════════
           CARDS-ONLY MODE
           ═══════════════════════════════════════ */

        .browse-root.map-hidden {
          display: flex;
          flex-direction: column;
        }

        .browse-root.map-hidden .browse-cards-scroll {
          max-width: 80rem;
          margin: 0 auto;
          width: 100%;
        }

        .browse-root.map-hidden .browse-toolbar {
          max-width: 80rem;
          margin: 0 auto;
          width: 100%;
        }

        .browse-root.map-hidden .browse-cards-grid {
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
        }
      `}</style>
    </>
  );
}
