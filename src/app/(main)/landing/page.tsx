"use client";

import React from 'react';
import { useEffect, useState } from "react";
import { floatingAnimations } from "./animations";
import ServicesSection from "./ServicesSection";
import ShowcaseSection from "./ShowcaseSection";


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

      {/*animation for circles*/}      
      <style>{floatingAnimations}</style>

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
      <section className="relative min-h-[75vh] flex items-start pt-16 md:pt-16 px-12 md:px-24 md:pb-12 pb-2 overflow-hidden">
        <div className="w-full flex flex-col md:flex-row justify-around gap-20">
            <div className="max-w-xl z-10">
                <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight leading-tight">
                    Welcome, <span style={{ color: colors.light_blue }}>Isko</span>
                </h1>
                <p className="text-base leading-relaxed opacity-80 max-w-md font-[family-name:var(--font-geist-mono)]">
                    Website description Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
                    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>

            {/* Decorative Circles Container */}
            <div className="hidden md:block relative w-[28rem] h-[28rem] self-center">
                {/* Front Circle */}
              <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 right-auto w-92 h-92 border rounded-full floatSlow" 
                style={{ borderColor: colors.light_blue }} 
              />
                {/* Back Circle */}
              <div 
                className="absolute top-[60%] left-[25%] -translate-x-1/2 -translate-y-1/2 right-auto w-72 h-72 rounded-full opacity-60 blur-[2px] floatSlowAlt" 
                style={{ backgroundColor: colors.gold }} 
              />
            </div>
        </div>
      </section>

      {/* Services  */}
      <ServicesSection />

      {/* Photos slideshow */}
      <ShowcaseSection />

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