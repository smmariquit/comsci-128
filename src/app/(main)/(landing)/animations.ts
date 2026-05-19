export const floatingAnimations = `
  /* Dorm Digest Animations */  
  @keyframes dd-ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
    .dd-ticker-scroll { animation: dd-ticker 28s linear infinite; }
    .dd-ticker-scroll:hover { animation-play-state: paused; }
    .dd-hero-zoom { transition: transform .4s ease; }
    .dd-hero-card:hover .dd-hero-zoom { transform: scale(1.04); }
    .dd-wide-zoom { transition: transform .35s ease; }
    .dd-wide-card:hover .dd-wide-zoom { transform: scale(1.06); }
    .dd-mini-zoom { transition: transform .35s ease; }
    .dd-mini:hover .dd-mini-zoom { transform: scale(1.07); }
    
  /*SERVICES SCROLL ANIMATIONS */
  @keyframes floatUpDown {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
  }

  .float-updown {
    animation: floatUpDown 6s ease-in-out infinite;
  }
  @keyframes cardSlideUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes iconPop {
    from { opacity: 0; transform: scale(0.5) rotate(-10deg); }
    to   { opacity: 1; transform: scale(1) rotate(0deg); }
  }
  @keyframes headerFadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .services-header-reveal {
    opacity: 0;
    transform: translateY(18px);
  }
  .services-header-reveal.visible {
    animation: headerFadeUp .55s ease forwards;
  }

  .service-card {
    /* keep all existing rules — add: */
    opacity: 0;
    transform: translateY(32px);
  }
  .service-card.card-visible {
    animation: cardSlideUp .55s ease forwards;
  }
  .service-card.card-visible .service-icon {
    animation: iconPop .4s cubic-bezier(.34,1.56,.64,1) forwards;
    animation-delay: inherit; /* picks up from card's delay */
  }

  /* shimmer line that sweeps across card on reveal */
  .service-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(194,211,208,.08) 50%,
      transparent 60%
    );
    background-size: 200% 100%;
    background-position: 200% 0;
    pointer-events: none;
    z-index: 1;
  }
  .service-card.card-visible::before {
    animation: shimmer .8s ease forwards;
  }
  @keyframes shimmer {
    from { background-position: 200% 0; }
    to   { background-position: -200% 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }

  @keyframes scrollDot {
    0% { opacity: 0; transform: translateY(0); }
    50% { opacity: 1; }
    100% { opacity: 0; transform: translateY(10px); }
  }

  .animate-float {
    animation: float 2s ease-in-out infinite;
  }

  .animate-scroll-dot {
    animation: scrollDot 1.5s infinite;
  }

  @keyframes floatSlow {
    0%   { transform: translate(0px, 0px); }
    25%  { transform: translate(10px, -15px); }
    50%  { transform: translate(0px, -25px); }
    75%  { transform: translate(-10px, -10px); }
    100% { transform: translate(0px, 0px); }
  }

  @keyframes floatSlowAlt {
    0%   { transform: translate(0px, 0px); }
    25%  { transform: translate(-15px, 10px); }
    50%  { transform: translate(-5px, 20px); }
    75%  { transform: translate(10px, 5px); }
    100% { transform: translate(0px, 0px); }
  }

  @keyframes floatSea {
    0%   { transform: translate(0px, 0px); }
    50%  { transform: translate(20px, -40px); }
    100% { transform: translate(0px, 0px); }
  }

  @keyframes fade {
    0% { opacity: 0; transform: translateY(10px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeUp {
    0%   { opacity: 0; transform: translateY(18px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseRing {
    0%   { transform: translate(-50%, -50%) scale(1);   opacity: 0.5; }
    100% { transform: translate(-50%, -50%) scale(1.18); opacity: 0; }
  }
  .float-slow     { animation: floatSlow    12s ease-in-out infinite; }
  .float-slow-alt { animation: floatSlowAlt 14s ease-in-out infinite; }
  .fade-up        { animation: fadeUp       0.7s ease both; }
  .fade-up-delay  { animation: fadeUp       0.7s 0.15s ease both; }
  .pulse-ring     { animation: pulseRing    3s ease-out infinite; }
`;