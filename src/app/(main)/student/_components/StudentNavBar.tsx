import Link from "next/link";
import { Bell } from "lucide-react";
import Logo from "@/app/components/Logo";
import Avatar from "@/app/components/Avatar";
import ThemeToggle from "@/app/components/ui/ThemeToggle";

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

						<nav className="hidden md:flex items-center gap-6 border-l border-gray-700 pl-8 h-7 font-[family-name:var(--font-geist-sans)]">
							<Link href="/student" className="text-[#EDE9DE] hover:opacity-80 transition-opacity flex items-center h-full text-m leading-none rounded-md px-2 focus-visible:-ml-2">
								Dashboard
							</Link>
							<Link href="/student/browse" className="text-[#EDE9DE] hover:opacity-80 transition-opacity flex items-center h-full text-m leading-none rounded-md px-2">
								Browse
							</Link>
						</nav>
						
					</div>

				<div className="flex items-center gap-2 md:gap-4">
					<ThemeToggle className="rounded-full p-2 hover:bg-white/10" />
					<button 
						suppressHydrationWarning
						className="flex items-center justify-center text-[#EDE9DE] hover:bg-white/10 transition-colors rounded-full p-2"
						>
							<Bell className="h-6 w-6" strokeWidth={2} />
					</button>

					<Link href={`/student/profile/${userId}`} className="flex items-center">
						<div className="h-8 w-8 aspect-square rounded-full bg-[#567375] cursor-pointer hover:ring-2 hover:ring-[#EDE9DE] transition-all"></div>
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
