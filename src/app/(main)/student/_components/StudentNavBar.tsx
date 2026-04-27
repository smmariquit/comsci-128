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
			<header className="flex h-[10vh] w-full max-w-[1440px] mx-auto bg-[#1C2632] items-center justify-between px-10 text-m">
				<div className="flex items-center gap-8">
					<h1 className="text-[#EDE9DE] text-xl font-semibold  font-[family-name:var(--font-geist-sans)] tracking-tight">
						UPLB CASA
					</h1>

					<nav className="flex items-center gap-6 border-l border-gray-700 pl-8  font-[family-name:var(--font-geist-sans)]">
						<a href="/student" className="text-[#EDE9DE]">
							Dashboard
						</a>
						<a
							href="/student/browse"
							className="text-[#EDE9DE] transition-colors"
						>
							Browse
						</a>
					</nav>
				</div>

				<div className="flex items-center gap-6">
					<button className="text-[#EDE9DE]">
						<Bell size={24} strokeWidth={2} />
					</button>

					<Link href={`/student/profile/${userId}`}>
						<div className="h-8 w-8 aspect-square rounded-full bg-[#567375] cursor-pointer transition-all"></div>
					</Link>
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
