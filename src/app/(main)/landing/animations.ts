export const floatingAnimations = `
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

  .floatSlow {
    animation: floatSlow 12s ease-in-out infinite;
  }

  .floatSlowAlt {
    animation: floatSlowAlt 14s ease-in-out infinite;
  }

  .animate-fade {
    animation: fade 0.5s ease;
  }
`;