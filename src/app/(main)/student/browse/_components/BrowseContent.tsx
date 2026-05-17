"use client";

import { useState, useCallback, useMemo, type ReactNode } from "react";
import Image from "next/image";
import HousingMap, { type HousingMarker } from "@/app/components/map/HousingMap";
import DormModal from "./DormModal";
import { getDormDetails } from "../_actions";
import { Map, LayoutGrid, Sparkles, X, Wifi, Armchair, Clock, Zap } from "lucide-react";

/* ────────────────────── Types ────────────────────── */

interface HousingCard {
  id: number;
  name: string;
  type: string;
  price: number | string;
  image?: string | null;
  lat: number | null;
  lng: number | null;
  // Amenities
  has_wifi: boolean;
  has_aircon: boolean;
  has_laundry: boolean;
  has_parking: boolean;
  has_no_curfew: boolean;
  allows_visitors: boolean;
  is_furnished: boolean;
  has_kitchen: boolean;
  has_security: boolean;
  has_utilities_included: boolean;
}

interface BrowseContentProps {
  cards: HousingCard[];
  searchBar: ReactNode;
  emptyState: ReactNode | null;
}

interface QuizAnswers {
  budget: string | null;        // "<3000" | "3000-5000" | "5000-8000" | "8000+"
  mustHave: string | null;      // "wifi" | "furnished" | "kitchen" | "aircon"
  curfew: string | null;        // "no_curfew" | "curfew_ok"
  visitors: string | null;      // "visitors_yes" | "visitors_no"
}

interface BoundsFilter {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

/* ────────────────────── Quiz Scoring ────────────────────── */

function scoreHousing(card: HousingCard, answers: QuizAnswers): number {
  let score = 0;
  let total = 0;

  // Budget match
  if (answers.budget) {
    total += 40; // Budget is heavily weighted
    const price = typeof card.price === "string" ? parseFloat(card.price) : card.price;
    switch (answers.budget) {
      case "<3000": if (price <= 3000) score += 40; else if (price <= 4000) score += 20; break;
      case "3000-5000": if (price >= 3000 && price <= 5000) score += 40; else if (price <= 6000) score += 20; break;
      case "5000-8000": if (price >= 5000 && price <= 8000) score += 40; else if (price <= 9000) score += 20; break;
      case "8000+": if (price >= 8000) score += 40; else if (price >= 6000) score += 20; break;
    }
  }

  // Must-have amenity
  if (answers.mustHave) {
    total += 25;
    switch (answers.mustHave) {
      case "wifi": if (card.has_wifi) score += 25; break;
      case "furnished": if (card.is_furnished) score += 25; break;
      case "kitchen": if (card.has_kitchen) score += 25; break;
      case "aircon": if (card.has_aircon) score += 25; break;
    }
  }

  // Curfew preference
  if (answers.curfew) {
    total += 20;
    if (answers.curfew === "no_curfew" && card.has_no_curfew) score += 20;
    else if (answers.curfew === "curfew_ok") score += 20; // Either way is fine
  }

  // Visitors preference
  if (answers.visitors) {
    total += 15;
    if (answers.visitors === "visitors_yes" && card.allows_visitors) score += 15;
    else if (answers.visitors === "visitors_no" && !card.allows_visitors) score += 15;
    else score += 5; // Partial
  }

  return total > 0 ? Math.round((score / total) * 100) : 0;
}

/* ────────────────────── Amenity Badges ────────────────────── */

function AmenityBadges({ card }: { card: HousingCard }) {
  const badges: { icon: ReactNode; label: string }[] = [];
  if (card.has_wifi) badges.push({ icon: <Wifi size={10} />, label: "WiFi" });
  if (card.is_furnished) badges.push({ icon: <Armchair size={10} />, label: "Furnished" });
  if (card.has_no_curfew) badges.push({ icon: <Clock size={10} />, label: "No Curfew" });
  if (card.has_utilities_included) badges.push({ icon: <Zap size={10} />, label: "Bills Incl." });

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {badges.slice(0, 4).map((b) => (
        <span
          key={b.label}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-[#C9642A]/20 text-[#C9642A]"
        >
          {b.icon}
          {b.label}
        </span>
      ))}
    </div>
  );
}

/* ────────────────────── Quiz Modal ────────────────────── */

function QuizModal({
  onComplete,
  onClose,
}: {
  onComplete: (answers: QuizAnswers) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    budget: null,
    mustHave: null,
    curfew: null,
    visitors: null,
  });

  const questions = [
    {
      title: "What is your monthly budget?",
      key: "budget" as const,
      options: [
        { value: "<3000", label: "Under ₱3,000" },
        { value: "3000-5000", label: "₱3,000 – ₱5,000" },
        { value: "5000-8000", label: "₱5,000 – ₱8,000" },
        { value: "8000+", label: "₱8,000+" },
      ],
    },
    {
      title: "What is your primary required amenity?",
      key: "mustHave" as const,
      options: [
        { value: "wifi", label: "WiFi" },
        { value: "furnished", label: "Furnished Room" },
        { value: "kitchen", label: "Kitchen Access" },
        { value: "aircon", label: "Air Conditioning" },
      ],
    },
    {
      title: "Do you have a curfew preference?",
      key: "curfew" as const,
      options: [
        { value: "no_curfew", label: "No curfew required" },
        { value: "curfew_ok", label: "Curfew is acceptable" },
      ],
    },
    {
      title: "What is your preference for visitors?",
      key: "visitors" as const,
      options: [
        { value: "visitors_yes", label: "Visitors allowed" },
        { value: "visitors_no", label: "No visitors allowed" },
      ],
    },
  ];

  const handleSelect = (key: keyof QuizAnswers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 200);
    } else {
      setTimeout(() => onComplete(newAnswers), 300);
    }
  };

  const q = questions[step];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-md overflow-hidden animate-[fadeInUp_0.3s_ease]">
        {/* Header */}
        <div className="bg-[#1C2632] px-5 py-4 flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold text-lg">Find My Housing</h3>
            <p className="text-white/50 text-xs">Step {step + 1} of {questions.length}</p>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-[#C9642A] transition-all duration-300"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="p-5">
          <h4 className="text-lg font-semibold text-[#1C2632] mb-4">{q.title}</h4>
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(q.key, opt.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all
                  ${answers[q.key] === opt.value
                    ? "border-[#C9642A] bg-[#C9642A]/10 text-[#C9642A] font-semibold"
                    : "border-gray-200 hover:border-[#C9642A]/50 hover:bg-gray-50"}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ────────────────────── Main Component ────────────────────── */

export default function BrowseContent({
  cards,
  searchBar,
  emptyState,
}: BrowseContentProps) {
  const [selectedDorm, setSelectedDorm] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  // Map bounds filter state
  const [boundsFilter, setBoundsFilter] = useState<BoundsFilter | null>(null);

  // Score + filter cards
  const processedCards = useMemo(() => {
    let result = cards.map((card) => ({
      ...card,
      matchScore: quizAnswers ? scoreHousing(card, quizAnswers) : null,
    }));

    // Filter by map bounds if active
    if (boundsFilter) {
      result = result.filter(
        (c) =>
          c.lat !== null &&
          c.lng !== null &&
          c.lat >= boundsFilter.minLat &&
          c.lat <= boundsFilter.maxLat &&
          c.lng >= boundsFilter.minLng &&
          c.lng <= boundsFilter.maxLng
      );
    }

    // Sort by match score if quiz is active
    if (quizAnswers) {
      result.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    }

    return result;
  }, [cards, quizAnswers, boundsFilter]);

  // Build map markers from real DB coordinates
  const markers: HousingMarker[] = processedCards
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
          // Amenities
          has_wifi: data.has_wifi ?? false,
          has_aircon: data.has_aircon ?? false,
          has_laundry: data.has_laundry ?? false,
          has_parking: data.has_parking ?? false,
          has_no_curfew: data.has_no_curfew ?? false,
          allows_visitors: data.allows_visitors ?? false,
          is_furnished: data.is_furnished ?? false,
          has_kitchen: data.has_kitchen ?? false,
          has_security: data.has_security ?? false,
          has_utilities_included: data.has_utilities_included ?? false,
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

  const handleBoundsChange = useCallback((bounds: BoundsFilter | null) => {
    setBoundsFilter(bounds);
  }, []);

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setShowQuiz(false);
  };

  const clearQuiz = () => {
    setQuizAnswers(null);
  };

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
              onBoundsDrawn={handleBoundsChange}
            />
          </div>
        )}

        {/* ── Right: Search + Cards ── */}
        <div className="browse-content-panel">
          {/* Search bar + toggle */}
          <div className="browse-toolbar">
            <div className="browse-search-area">{searchBar}</div>
            <div className="flex gap-2 flex-shrink-0">
              {/* Quiz button */}
              {!quizAnswers ? (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="browse-quiz-btn"
                  id="find-my-housing"
                >
                  <Sparkles size={14} />
                  <span className="hidden sm:inline">Find My Housing</span>
                </button>
              ) : (
                <button
                  onClick={clearQuiz}
                  className="browse-quiz-btn browse-quiz-active"
                  id="clear-quiz"
                >
                  <X size={14} />
                  <span className="hidden sm:inline">Clear Quiz</span>
                </button>
              )}
              {/* Map toggle */}
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
          </div>

          {/* Active filters indicator */}
          {(quizAnswers || boundsFilter) && (
            <div className="flex items-center gap-2 px-4 py-1.5 text-xs">
              {quizAnswers && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#C9642A]/10 text-[#C9642A] font-medium">
                  <Sparkles size={10} />
                  Quiz active · {processedCards.length} results
                </span>
              )}
              {boundsFilter && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                  <Map size={10} />
                  Area filter · {processedCards.length} in bounds
                  <button
                    onClick={() => setBoundsFilter(null)}
                    className="ml-1 hover:text-blue-900"
                  >
                    <X size={10} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Scrollable cards area */}
          <div className="browse-cards-scroll">
            {emptyState && processedCards.length === 0 && !quizAnswers && !boundsFilter ? (
              <div className="p-6">{emptyState}</div>
            ) : processedCards.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p className="text-lg font-semibold">No housing matches</p>
                <p className="text-sm mt-1">Try adjusting your quiz answers or clearing the area filter.</p>
              </div>
            ) : (
              <div className="browse-cards-grid">
                {processedCards.map((card) => (
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
                    <div className="flex-1 bg-[#1C2632] px-3.5 py-3 flex flex-col gap-1 font-[family-name:var(--font-geist-sans)]">
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
                      <AmenityBadges card={card} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <QuizModal
          onComplete={handleQuizComplete}
          onClose={() => setShowQuiz(false)}
        />
      )}

      {/* Dorm Modal */}
      {selectedDorm && (
        <DormModal 
          dorm={selectedDorm} 
          onClose={() => setSelectedDorm(null)}
          onViewMap={() => {
            setShowMap(true);
            setSelectedCardId(selectedDorm.id);
            setSelectedDorm(null);
          }}
        />
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

        .browse-toggle-btn,
        .browse-quiz-btn {
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

        .browse-quiz-btn {
          background: #C9642A;
        }

        .browse-quiz-btn:hover {
          background: #b5572a;
        }

        .browse-quiz-active {
          background: #8AABAC;
        }

        .browse-quiz-active:hover {
          background: #7a9a9b;
        }

        .browse-toggle-btn:hover {
          background: #2a3a4e;
        }

        .browse-toggle-btn:active,
        .browse-quiz-btn:active {
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

          .browse-root.map-visible .browse-map-panel {
            width: 50%;
            height: calc(100vh - 5.5rem);
            min-height: 0;
            flex-shrink: 0;
          }

          .browse-root.map-visible .browse-content-panel {
            width: 50%;
            height: calc(100vh - 5.5rem);
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          .browse-root.map-visible .browse-cards-scroll {
            flex: 1;
            overflow-y: auto;
            padding: 1rem 1.5rem 2rem;
          }

          .browse-root.map-visible .browse-cards-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 0.75rem;
          }

          .browse-root.map-visible .browse-cards-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .browse-root.map-visible .browse-cards-scroll::-webkit-scrollbar-track {
            background: transparent;
          }
          .browse-root.map-visible .browse-cards-scroll::-webkit-scrollbar-thumb {
            background: rgba(28, 38, 50, 0.15);
            border-radius: 3px;
          }
          .browse-root.map-visible .browse-cards-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(28, 38, 50, 0.3);
          }

          .browse-root.map-visible .browse-toolbar {
            padding: 0.5rem 1.5rem;
          }
        }

        @media (min-width: 1440px) {
          .browse-root.map-visible .browse-map-panel {
            width: 55%;
          }

          .browse-root.map-visible .browse-content-panel {
            width: 45%;
          }

          .browse-root.map-visible .browse-cards-grid {
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

        .browse-root.map-hidden .browse-content-panel {
          width: 100%;
        }

        .browse-root.map-hidden .browse-cards-scroll {
          max-width: 80rem;
          margin: 0 auto;
          width: 100%;
          padding: 1rem 1.5rem 2rem;
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
