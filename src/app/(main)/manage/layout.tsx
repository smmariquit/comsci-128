import type { Metadata } from "next";
import Link from "next/link";
import { Bell } from "lucide-react";
import Breadcrumbs from "./components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Manager Dashboard",
  description: "Manager panel for managing properties, applications, and tenants.",
};

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV BAR */}
      <header className="w-full bg-[#1C2632] text-m">
        <div className=" mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-10">
          <div className="flex items-center gap-4 md:gap-8">
            <h1 className="text-[#EDE9DE] text-lg md:text-xl font-semibold font-[family-name:var(--font-geist-sans)] tracking-tight">
              UPLB CASA
            </h1>

            <nav className="hidden md:flex items-center gap-6 border-l border-gray-700 pl-8 font-[family-name:var(--font-geist-sans)]">
              <Link href="/manage" className="text-[#EDE9DE] hover:opacity-80 transition-opacity py-3">
                Dashboard
              </Link>
              <Link
                href="/manage/accommodations"
                className="text-[#EDE9DE] hover:opacity-80 transition-opacity py-3"
              >
                Accommodations
              </Link>
              <Link
                href="/manage/applications"
                className="text-[#EDE9DE] hover:opacity-80 transition-opacity py-3"
              >
                Applications
              </Link>
            </nav>
          </div>

          <div className="flex items-between gap-4 md:gap-2">
            {/* Mobile Nav Link */}
            <Link href="/manage" className="md:hidden text-[#EDE9DE] text-xs font-medium">
              Dashboard
            </Link>

            <button className="text-[#EDE9DE] hover:opacity-80 transition-opacity items-center justify-center">
              <Bell size={22} strokeWidth={2} />
            </button>

            <Link href="/manage/profile/21" className="py-2">
              <div className="h-8 w-8 aspect-square rounded-full bg-[#567375] cursor-pointer hover:ring-2 hover:ring-[#EDE9DE] transition-all items-center justify-center" ></div>
            </Link>
          </div>
        </div>
      </header>

      {/* BREAD CRUMBS */}
      <div className="w-full bg-[#567375] font-[family-name:var(--font-geist-sans)]">
        <div className="flex items-center px-4 md:px-10 min-h-[44px] align-middle">
          <Breadcrumbs />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-[var(--cream)]">{children}</main>

      {/* FOOTER */}
      <footer className="bg-[#1C2632] text-[#EDE9DE] px-6 py-10 text-sm">
        <div className="max-w-7xl mx-auto">
          © 2026 CMSC 128 Project
        </div>
      </footer>
    </div>
  );
}