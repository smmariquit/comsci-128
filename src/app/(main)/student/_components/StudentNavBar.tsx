import Link from "next/link";
import { Bell } from "lucide-react";
import Logo from "@/app/components/Logo";
import Avatar from "@/app/components/Avatar";

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

						<nav className="hidden md:flex items-center gap-4 border-l border-gray-700 pl-8 h-7 font-[family-name:var(--font-geist-sans)]">
							<Link href="/student" className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#C9642A] focus-visible:outline-none transition-colors flex items-center h-full text-m leading-none rounded-md px-3 py-1">
								Dashboard
							</Link>
							<Link href="/student/browse" className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#C9642A] focus-visible:outline-none transition-colors flex items-center h-full text-m leading-none rounded-md px-3 py-1">
								Browse
							</Link>
						</nav>
						
					</div>

				<div className="flex items-center gap-2 md:gap-4">
					<button 
						suppressHydrationWarning
						className="flex items-center justify-center text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#C9642A] focus-visible:outline-none transition-colors rounded-full p-2"
						aria-label="Notifications"
						>
							<Bell className="h-6 w-6" strokeWidth={2} />
					</button>

					<Link href={`/student/profile/${userId}`} className="flex items-center justify-center w-8 h-8 rounded-full focus-visible:ring-2 focus-visible:ring-[#C9642A] focus-visible:outline-none bg-[#567375] hover:ring-2 hover:ring-[#EDE9DE] transition-all" aria-label="Profile">
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
