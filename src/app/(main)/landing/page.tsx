import React from 'react';

export default function LandingPage() {
  // Mapping colors
  const colors = {
    cream: '#EDE9DE',
    navy: '#1C2632',
    orange: '#C9642A',
    gold: '#E3AF64',
    light_blue: '#567375',
  };

  return (
    <div 
      className="min-h-screen font-[family-name:var(--font-geist-sans)]"
      style={{ backgroundColor: colors.cream, color: colors.navy }}
    >
      {/* Title w Login/signup */}
      <nav className="flex justify-between items-center px-8 py-6 md:px-16">
        <div className="font-bold text-xl font-[family-name:var(--font-geist-sans)]">Title</div>
        <div className="flex items-center gap-6">
          <button style={{ color: colors.orange }} className="font-medium hover:underline">
            Log in
          </button>
          <button 
            style={{ backgroundColor: colors.orange }}
            className="text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* Welcome*/}
      <section className="relative px-8 md:px-16 pt-16 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="max-w-xl z-10">
                <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
                    Welcome, <span style={{ color: colors.light_blue }}>Isko</span>
                </h1>
                <p className="text-lg leading-relaxed opacity-80 max-w-md font-[family-name:var(--font-geist-mono)]">
                    Website description Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>

            {/* Decorative Circles Container */}
            <div className="hidden md:block relative w-96 h-96">
                <div 
                    className="absolute top-0 right-0 w-72 h-72 border-[1px] rounded-full z-0" 
                    style={{ borderColor: colors.light_blue }}
                />
                
                <div 
                    className="absolute top-30 right-50 w-56 h-56 rounded-full opacity-60 z-10" 
                    style={{ backgroundColor: colors.gold }}
                />
            </div>
        </div>
      </section>

      {/* Services  */}
      <section 
        className="py-20 px-8 md:px-16"
        style={{ backgroundColor: colors.navy }}
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-white text-2xl font-bold text-center mb-12 font-[family-name:var(--font-geist-sans)]">
            Our Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                style={{ backgroundColor: colors.orange }}
                className="aspect-[4/5] rounded-2xl shadow-xl hover:scale-105 transition-transform cursor-pointer" 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Photos slideshow */}
      <section className="py-20 px-8 md:px-16">
        <div className="max-w-7xl mx-auto">
          <div 
            className="w-full h-96 rounded-3xl opacity-40" 
            style={{ backgroundColor: colors.light_blue }}
          />
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="py-10 px-8 text-center text-xs font-[family-name:var(--font-geist-mono)] leading-relaxed space-y-1"
        style={{ backgroundColor: colors.light_blue, color: colors.cream }}
      >
        <p>© 2026 Website Name</p>
        <p>University of the Philippines Los Baños AY 2025-2026</p>
        <p>In partial fulfillment of the requirements for CMSC 128: Software Engineering</p>
      </footer>
    </div>
  );
}