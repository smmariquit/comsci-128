"use client";
import { useState } from "react";
import Link from "next/link";
import { Bell, Menu, X } from "lucide-react";

interface StudentNavbarProps {
	path: string;
	userId?: number;
}

export default function StudentNavBar({ path, userId }: StudentNavbarProps) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			{/* NAV BAR */}
			<header className="relative flex h-[10vh] w-full max-w-[1440px] mx-auto bg-[#1C2632] items-center justify-between px-5 sm:px-10 text-m">
				<div className="flex items-center gap-8">
					{/* Hamburger Menu for mobile*/}
					<button 
                        className="sm:hidden text-[#EDE9DE] p-1 -ml-1"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

					<h1 className="text-[#EDE9DE] text-xl font-semibold  font-[family-name:var(--font-geist-sans)] tracking-tight">
						UPLB CASA
					</h1>

					<nav className="hidden sm:flex items-center gap-6 border-l border-gray-700 pl-8 font-[family-name:var(--font-geist-sans)] ">
						<a href="/student" className="text-[#EDE9DE]">
						Dashboard
						</a>
						<a href="/student/browse" className="text-[#EDE9DE] transition-colors">
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

			{/*Mobile Menu Overlay*/}
            {isOpen && (
                <div className="absolute top-20 left-5 w-[50%] z-50 bg-[#1C2632] border-t border-gray-700 p-6 rounded-xl flex flex-col gap-6 sm:hidden shadow-2xl">
                    <nav className="flex flex-col gap-5 text-[#EDE9DE]">
                        <Link href="/student" onClick={() => setIsOpen(false)} className="text-lg">
                            Dashboard
                        </Link>
                        <Link href="/student/browse" onClick={() => setIsOpen(false)} className="text-lg">
                            Browse
                        </Link>
                    </nav>
                </div>
            )}

			{/* BREAD CRUMBS */}
			<div className="flex flex-col bg-[#567375] px-[36px] py-[6px] justify-center font-[family-name:var(--font-geist-sans)]">
				<div className="text-[#EDE9DE] text-[13px] font-sans font-regular">
					{path}
				</div>
			</div>
		</>
	);
}
