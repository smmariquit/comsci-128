export const floatingAnimations = `
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