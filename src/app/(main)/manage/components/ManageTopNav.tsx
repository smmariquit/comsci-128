"use client";

import Link from "next/link";
import { Bell, Menu, X } from "lucide-react";
import { useState } from "react";

export default function ManageTopNav() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <header className="w-full bg-[#1C2632] text-m">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:h-20 md:px-10">
        <div className="flex items-center gap-4 md:gap-8">
          <button
            type="button"
            className="text-[#EDE9DE] md:hidden"
            aria-label={isNavOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            {isNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-lg font-semibold tracking-tight text-[#EDE9DE] font-[family-name:var(--font-geist-sans)] md:text-xl">
            UPLB CASA
          </h1>

          <nav className="hidden items-center gap-6 border-l border-gray-700 pl-8 font-[family-name:var(--font-geist-sans)] md:flex">
            <Link
              href="/manage"
              className="py-3 text-[#EDE9DE] transition-opacity hover:opacity-80"
            >
              Dashboard
            </Link>
            <Link
              href="/manage/accommodations"
              className="py-3 text-[#EDE9DE] transition-opacity hover:opacity-80"
            >
              Accommodations
            </Link>
            <Link
              href="/manage/applications"
              className="py-3 text-[#EDE9DE] transition-opacity hover:opacity-80"
            >
              Applications
            </Link>
            <Link
              href="/manage/complaints"
              className="py-3 text-[#EDE9DE] transition-opacity hover:opacity-80"
            >
              Complaints
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <button
            type="button"
            className="items-center justify-center text-[#EDE9DE] transition-opacity hover:opacity-80"
          >
            <Bell size={22} strokeWidth={2} />
          </button>

          <Link href="/manage/profile/21">
            <div className="aspect-square h-8 w-8 cursor-pointer rounded-full bg-[#567375] transition-all hover:ring-2 hover:ring-[#EDE9DE]" />
          </Link>
        </div>
      </div>

      {isNavOpen && (
        <nav className="border-t border-gray-700 px-4 py-3 font-[family-name:var(--font-geist-sans)] md:hidden">
          <div className="flex flex-col gap-2">
            <Link
              href="/manage"
              onClick={() => setIsNavOpen(false)}
              className="py-2 text-[#EDE9DE] transition-opacity hover:opacity-80"
            >
              Dashboard
            </Link>
            <Link
              href="/manage/accommodations"
              onClick={() => setIsNavOpen(false)}
              className="py-2 text-[#EDE9DE] transition-opacity hover:opacity-80"
            >
              Accommodations
            </Link>
            <Link
              href="/manage/applications"
              onClick={() => setIsNavOpen(false)}
              className="py-2 text-[#EDE9DE] transition-opacity hover:opacity-80"
            >
              Applications
            </Link>
            <Link
              href="/manage/complaints"
              onClick={() => setIsNavOpen(false)}
              className="py-2 text-[#EDE9DE] transition-opacity hover:opacity-80"
            >
              Complaints
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
