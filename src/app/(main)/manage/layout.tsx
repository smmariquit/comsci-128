import { Bell } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/app/components/Logo";
import Breadcrumbs from "./components/Breadcrumbs";
import Avatar from "@/app/components/Avatar";
import { getManagerAccountNumber } from "@/app/lib/auth";
import { userData } from "@/app/lib/data/user-data";

export const metadata: Metadata = {
  title: "Manager Dashboard",
  description:
    "Manager panel for managing properties, applications, and tenants.",
};

export default async function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accountNumber = await getManagerAccountNumber();
  let managerUser = null;
  try {
    managerUser = accountNumber ? await userData.findById(accountNumber) : null;
  } catch (error) {
    console.warn("Offline: Could not load manager user for layout.");
  }

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)]">
      {/* NAV BAR */}
      <header className="w-full bg-[#1C2632] text-m">
        <div className="w-full max-w-7xl mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-10">
          <div className="flex items-center gap-4 md:gap-8">
            <Logo size={28} href="/manage" />

            <nav className="hidden md:flex items-center gap-4 border-l border-gray-700 pl-8 font-[family-name:var(--font-geist-sans)]">
              <Link
                href="/manage"
                className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 transition-colors py-2 rounded-full px-4"
              >
                Dashboard
              </Link>
              <Link
                href="/manage/accommodations"
                className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 transition-colors py-2 rounded-full px-4"
              >
                Accommodations
              </Link>
              <Link
                href="/manage/applications"
                className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 transition-colors py-2 rounded-full px-4"
              >
                Applications
              </Link>
              <Link
                href="/manage/complaints"
                className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 transition-colors py-2 rounded-full px-4"
              >
                Complaints
              </Link>
              <Link
                href="/manage/logs"
                className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 transition-colors py-2 rounded-full px-4"
              >
                Audit Logs
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4 text-sm">
            {/* Mobile Nav Link */}
            <Link
              href="/manage"
              className="md:hidden text-[#EDE9DE] text-xs font-medium hover:bg-white/10 focus-visible:bg-white/10 rounded-full px-3 py-1.5"
            >
              Dashboard
            </Link>

            <button
              type="button"
              className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 transition-colors flex items-center justify-center rounded-full p-2"
              aria-label="Notifications"
            >
              <Bell size={22} strokeWidth={2} />
            </button>

            <div className="py-2">
              <Avatar
                firstName={managerUser?.first_name}
                lastName={managerUser?.last_name}
                size={32}
                href={`/manage/profile/${accountNumber}`}
              />
            </div>
          </div>
        </div>
      </header>

      {/* BREAD CRUMBS */}
      <div className="w-full bg-[#567375] font-[family-name:var(--font-geist-sans)]">
        <div className="w-full max-w-7xl mx-auto flex items-center px-4 md:px-10 min-h-[44px] align-middle">
          <Breadcrumbs />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-[var(--cream)]">{children}</main>

      {/* FOOTER */}
      <footer className="bg-[#1C2632] text-[#EDE9DE] px-6 py-10 text-sm">
        <div className="max-w-7xl mx-auto">© 2026 CMSC 128 Project</div>
      </footer>
    </div>
  );
}
