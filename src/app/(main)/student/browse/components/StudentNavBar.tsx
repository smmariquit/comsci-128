import React from "react";

interface StudentNavbarProps {
  path: string; // Define the prop here
}

export default function StudentNavBar({path}: StudentNavbarProps) {
  return (
    <>
      {/* NAV BAR */}
      <header className="flex h-[10vh] w-full max-w-[1440px] bg-[#1C2632] items-center justify-between px-10 text-m">
        <div className="flex items-center gap-8">
          <h1 className="text-[#EDE9DE] text-xl font-semibold  font-[family-name:var(--font-geist-sans)] tracking-tight">
            Title
          </h1>

          <nav className="flex items-center gap-6 border-l border-gray-700 pl-8  font-[family-name:var(--font-geist-sans)]">
            <a href="/student/dashboard" className="text-[#EDE9DE]">
              Dashboard
            </a>
            <a href="/student" className="text-[#EDE9DE] transition-colors">
              Browse
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-[#EDE9DE]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>

          <div className="h-8 w-8 aspect-square rounded-full bg-[#567375] cursor-pointer transition-all"></div>
        </div>
      </header>

      {/* BREAD CRUMBS */}
      <div className="flex flex-col bg-[#567375] px-[36px] py-[6px] justify-center font-[family-name:var(--font-geist-sans)]">
        <div className="text-[#EDE9DE] text-[13px] font-sans font-regular">
          {path}
        </div>
      </div>
    </>
  );
}