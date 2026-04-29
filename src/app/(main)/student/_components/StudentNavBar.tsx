import Link from "next/link";
import { Bell } from "lucide-react";

interface StudentNavbarProps {
	path: string;
	userId?: number;
}

export default function StudentNavBar({ path, userId }: StudentNavbarProps) {
	return (
		<>
			{/* NAV BAR */}
			<header className="w-full bg-[#1C2632] text-m">
				<div className="max-w-7xl mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-10">
					<div className="flex items-center gap-4 md:gap-8">
						<h1 className="text-[#EDE9DE] text-lg md:text-xl font-semibold font-[family-name:var(--font-geist-sans)] tracking-tight flex items-center">
							UPLB CASA
						</h1>

						<nav className="hidden md:flex items-center gap-6 border-l border-gray-700 pl-8 font-[family-name:var(--font-geist-sans)] h-full">
							<a href="/student" className="text-[#EDE9DE] hover:opacity-80 transition-opacity flex items-center h-full">
								Dashboard
							</a>
							<a
								href="/student/browse"
								className="text-[#EDE9DE] hover:opacity-80 transition-opacity flex items-center h-full"
							>
								Browse
							</a>
						</nav>
					</div>

					<div className="flex items-center gap-4 md:gap-6">
						{/* Mobile Nav Link */}
						<a href="/student" className="md:hidden text-[#EDE9DE] text-xs font-medium flex items-center">Dashboard</a>
						
						<button className="text-[#EDE9DE] hover:opacity-80 transition-opacity flex items-center">
							<Bell size={22} strokeWidth={2} />
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
