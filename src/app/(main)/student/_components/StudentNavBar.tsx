import Link from "next/link";
import { Bell } from "lucide-react";
import Logo from "@/app/components/Logo";

interface StudentNavbarProps {
  path: string;
  userId?: number;
  userName?: string;
}

function getInitials(name?: string) {
  if (!name) return "S";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  if (parts.length > 1)
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  return "S";
}

export default function StudentNavBar({
  path,
  userId,
  userName,
}: StudentNavbarProps) {
  return (
    <>
      {/* NAV BAR */}
      <header className="w-full bg-[#1C2632] text-m">
        <div className="max-w-7xl mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-10">
          <div className="flex items-center gap-4 md:gap-8">
            <Logo size={28} href="/" />

            <nav className="hidden md:flex items-center gap-6 border-l border-gray-700 pl-8 font-[family-name:var(--font-geist-sans)]">
              <a
                href="/student"
                className="text-[#EDE9DE] hover:opacity-80 transition-opacity"
              >
                Dashboard
              </a>
              <a
                href="/student/browse"
                className="text-[#EDE9DE] hover:opacity-80 transition-opacity"
              >
                Browse
              </a>
              <a
                href="/student/complaints"
                className="text-[#EDE9DE] hover:opacity-80 transition-opacity"
              >
                Complaints
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button className="text-[#EDE9DE]">
              <Bell className="h-6 w-6" strokeWidth={2} />
            </button>

            <Link
              href={`/student/profile/${userId}`}
              className="flex items-center gap-3"
            >
              {userName && (
                <span className="hidden md:block text-[#EDE9DE] text-sm font-medium font-[family-name:var(--font-geist-sans)]">
                  {userName}
                </span>
              )}
              <div className="h-8 w-8 rounded-full bg-[#567375] flex items-center justify-center text-[#EDE9DE] text-xs font-bold cursor-pointer hover:ring-2 hover:ring-[#EDE9DE] transition-all">
                {getInitials(userName)}
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* BREAD CRUMBS */}
      <div className="w-full bg-[#567375] font-[family-name:var(--font-geist-sans)]">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-2 text-[#EDE9DE] text-[13px] font-sans font-regular">
          {path}
        </div>
      </div>
    </>
  );
}
