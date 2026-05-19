"use client";

import { useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, X, Map, LayoutGrid, Wifi, Armchair, Clock, Zap, Loader2, CheckCircle2 } from "lucide-react";
import HousingMap, { type HousingMarker } from "@/app/components/map/HousingMap";
import Isolated3DViewer from "@/app/components/map/Isolated3DViewer";
import DormModal from "./DormModal";
import PageLoading from "@/app/components/ui/page-loading";
import { getDormDetails } from "../_actions";
import { usePGliteHousing } from "@/app/hooks/usePGliteHousing";

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
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium bg-[#f2e3d7] text-[#111820]"
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="quiz-modal-title" aria-describedby="quiz-modal-step">
      <div className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-md overflow-hidden animate-[fadeInUp_0.3s_ease]">
        {/* Header */}
        <div className="bg-[#1C2632] px-5 py-4 flex justify-between items-center">
          <div>
            <h3 id="quiz-modal-title" className="text-white font-bold text-lg">Find My Housing</h3>
            <p id="quiz-modal-step" className="text-white/90 text-sm">Step {step + 1} of {questions.length}</p>
          </div>
          <button onClick={onClose} className="text-white hover:text-white transition" aria-label="Close housing quiz">
            <X size={20} aria-hidden="true" />
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
          <h4 className="text-lg font-semibold text-[#111820] mb-4">{q.title}</h4>
          <div className="flex flex-col gap-2">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(q.key, opt.value)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-[#111820]
                  ${answers[q.key] === opt.value
                    ? "border-[#8b3e15] bg-[#f2e3d7] font-semibold"
                    : "border-gray-200 hover:border-[#8b3e15]/50 hover:bg-gray-50"}`}
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
  const [mapViewTrigger, setMapViewTrigger] = useState(0);
  const [isolatedDorm, setIsolatedDorm] = useState<any | null>(null);

  const router = useRouter();

  const { isOffline, getOfflineDormDetails, saveDormDetailsLocally, getAllOfflineDorms } = usePGliteHousing();
  const [offlineCards, setOfflineCards] = useState<HousingCard[]>([]);


  useEffect(() => {
    if (isOffline && cards.length === 0) {
      getAllOfflineDorms().then(rows => {
        const formatted = rows.map((item: any) => ({
          id: item.housing_id,
          name: item.housing_name,
          type: item.housing_type,
          price: item.rent_price,
          lat: item.latitude,
          lng: item.longitude,
          image: item.housing_image || null,
          has_wifi: item.has_wifi ?? false,
          has_aircon: item.has_aircon ?? false,
          has_laundry: item.has_laundry ?? false,
          has_parking: item.has_parking ?? false,
          has_no_curfew: item.has_no_curfew ?? false,
          allows_visitors: item.allows_visitors ?? false,
          is_furnished: item.is_furnished ?? false,
          has_kitchen: item.has_kitchen ?? false,
          has_security: item.has_security ?? false,
          has_utilities_included: item.has_utilities_included ?? false,
        }));
        setOfflineCards(formatted);
      });
    }
  }, [isOffline, cards.length, getAllOfflineDorms]);

  const displayCards = cards.length > 0 ? cards : offlineCards;

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  // Map bounds filter state
  const [boundsFilter, setBoundsFilter] = useState<BoundsFilter | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 6;

  // Reset pagination on filter or bounds change
  useEffect(() => {
    setCurrentPage(1);
  }, [boundsFilter, quizAnswers, cards]);

  // Score + filter cards
  const processedCards = useMemo(() => {
    let result = displayCards.map((card) => ({
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
  }, [displayCards, quizAnswers, boundsFilter]);

  // Paginated cards calculation
  const paginatedCards = useMemo(() => {
    const start = (currentPage - 1) * cardsPerPage;
    return processedCards.slice(start, start + cardsPerPage);
  }, [processedCards, currentPage]);

  const totalPages = Math.ceil(processedCards.length / cardsPerPage) || 1;
  const rangeStart = processedCards.length === 0 ? 0 : (currentPage - 1) * cardsPerPage + 1;
  const rangeEnd = Math.min(currentPage * cardsPerPage, processedCards.length);

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
      let data = null;
      if (isOffline) {
        data = await getOfflineDormDetails(id);
      } else {
        data = await getDormDetails(id);
        if (data) await saveDormDetailsLocally(data);
      }

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
          raw_start: data.start_application_date || null,
          raw_end: data.end_application_date || null,
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
          latitude: data.latitude,
          longitude: data.longitude,
        });
      }
    } finally {
      setIsFetching(false);
    }
  }, [isOffline, getOfflineDormDetails, saveDormDetailsLocally]);

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
      {isFetching && <PageLoading overlay label="Fetching Housing Details..." />}

      <main className={`browse-root ${showMap ? "map-visible" : "map-hidden"}`} aria-labelledby="browse-housing-heading">
        {/* ── Left: Map ── */}
        {showMap && (
          <div className="browse-map-panel">
            <HousingMap
              housings={markers}
              selectedId={selectedCardId}
              viewTrigger={mapViewTrigger}
              onMarkerClick={handleMarkerClick}
              onBoundsDrawn={handleBoundsChange}
            />
          </div>
        )}

        {/* ── Right: Search + Cards ── */}
        <div className="browse-content-panel">
          {/* Search bar + toggle */}
          <div className="browse-toolbar" aria-label="Housing filters and view options">
            <h1 id="browse-housing-heading" className="sr-only">Browse Housing</h1>
            <div className="browse-search-area">{searchBar}</div>
            <div className="flex gap-2 flex-shrink-0">
              {/* Quiz button */}
              {!quizAnswers ? (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="browse-quiz-btn"
                  id="find-my-housing"
                  aria-label="Open housing quiz"
                >
                  <Sparkles size={14} aria-hidden="true" />
                  <span className="hidden sm:inline">Find My Housing</span>
                </button>
              ) : (
                <button
                  onClick={clearQuiz}
                  className="browse-quiz-btn browse-quiz-active"
                  id="clear-quiz"
                  aria-label="Clear housing quiz"
                >
                  <X size={14} aria-hidden="true" />
                  <span className="hidden sm:inline">Clear Quiz</span>
                </button>
              )}
              {/* Map toggle */}
              <button
                onClick={() => setShowMap(!showMap)}
                className="browse-toggle-btn"
                id="toggle-map-view"
                aria-label={showMap ? "Show cards only" : "Show map"}
              >
                {showMap ? (
                  <>
                    <LayoutGrid size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Cards Only</span>
                  </>
                ) : (
                  <>
                    <Map size={16} aria-hidden="true" />
                    <span className="hidden sm:inline">Show Map</span>
                  </>
                )}
              </button>
            </div>
          </div>
          {/* Scrollable cards area */}
          <div className="browse-cards-scroll relative">

            {/* Active Filters (Static layout, no overlap) */}
            {(quizAnswers || boundsFilter) && (
              <div className="flex items-center flex-wrap gap-2 text-xs font-[family-name:var(--font-geist-mono)] tracking-wider px-6 pt-4 pb-2 w-full">
                {quizAnswers && (
                  <div className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#8b3e15] text-white font-bold shadow-sm">
                    <Sparkles size={12} aria-hidden="true" />
                    <span>QUIZ ACTIVE ({processedCards.length})</span>
                  </div>
                )}
                {boundsFilter && (
                  <div className="inline-flex items-center gap-1.5 h-8 pl-3 pr-1 rounded-full bg-[#1C2632] text-white font-bold shadow-sm">
                    <Map size={12} aria-hidden="true" />
                    <span>AREA FILTERED ({processedCards.length})</span>
                    <button
                      onClick={() => setBoundsFilter(null)}
                      className="h-6 w-6 shrink-0 flex items-center justify-center hover:bg-white/20 text-white/60 hover:text-white rounded-full transition-colors"
                      aria-label="Clear area filter"
                    >
                      <X size={12} strokeWidth={2.5} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {emptyState && processedCards.length === 0 && !quizAnswers && !boundsFilter ? (
              <div className="p-6">{emptyState}</div>
            ) : processedCards.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p className="text-lg font-semibold">No housing matches</p>
                <p className="text-sm mt-1">Try adjusting your quiz answers or clearing the area filter.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div className="browse-cards-grid">
                  {paginatedCards.map((card) => (
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
                      className={`flex flex-col cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:scale-[1.02] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#8b3e15] focus-visible:outline-none focus-visible:ring-offset-2 text-left
                        ${selectedCardId === card.id ? "ring-2 ring-[#8b3e15] ring-offset-2 scale-[1.01]" : ""}`}
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
                        <AmenityBadges card={card} />
                      </div>
                    </button>
                  ))}
                </div>

                {/* Pagination Toolbar */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 8,
                      borderTop: "1px solid #e3d8c9",
                      paddingTop: 16,
                      flexWrap: "wrap",
                      gap: 10,
                      fontFamily: "var(--font-geist-sans), sans-serif",
                    }}
                  >
                    <span style={{ fontSize: 13, color: "#567375" }}>
                      Showing <strong>{rangeStart}</strong> to <strong>{rangeEnd}</strong> of <strong>{processedCards.length}</strong> housings
                    </span>

                    <div style={{ display: "flex", gap: 5 }}>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: currentPage === 1 ? "#ccc" : "#1C2632",
                          background: "#fff",
                          border: "1px solid #e8e4db",
                          borderRadius: 8,
                          padding: "6px 12px",
                          cursor: currentPage === 1 ? "not-allowed" : "pointer",
                        }}
                      >
                        Prev
                      </button>

                      {getVisiblePages(currentPage, totalPages).map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (typeof p === "number") {
                              setCurrentPage(p);
                            }
                          }}
                          disabled={p === "..."}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: currentPage === p ? "#fff" : "#1C2632",
                            background: currentPage === p ? "#8b3e15" : "#fff",
                            border: `1px solid ${currentPage === p ? "#8b3e15" : "#e8e4db"}`,
                            borderRadius: 8,
                            width: 32,
                            height: 32,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: p === "..." ? "default" : "pointer",
                          }}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: currentPage === totalPages ? "#ccc" : "#1C2632",
                          background: "#fff",
                          border: "1px solid #e8e4db",
                          borderRadius: 8,
                          padding: "6px 12px",
                          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                        }}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

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
            setIsolatedDorm(selectedDorm);
            setSelectedDorm(null);
          }}
        />
      )}

      {/* Isolated 3D Viewer */}
      {isolatedDorm && (
        <Isolated3DViewer
          housing={{
            name: isolatedDorm.name,
            lng: isolatedDorm.longitude || 0,
            lat: isolatedDorm.latitude || 0,
            rooms: (isolatedDorm as any).room || [], // pass the real db rooms
          }}
          onClose={() => setIsolatedDorm(null)}
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

// Helper to limit visible pagination buttons
const getVisiblePages = (currentPage: number, totalPages: number) => {
  const pages: (number | string)[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage > 3) {
      pages.push('...');
    }
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    pages.push(totalPages);
  }
  return pages;
};
