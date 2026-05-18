"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import Logo from "@/app/components/Logo";
import Avatar from "@/app/components/Avatar";
import { useEffect, useState } from "react";

interface StudentNavbarProps {
  path: string;
  userId?: number;
  firstName?: string | null;
  lastName?: string | null;
  profilePicture?: string | null;
}

export default function StudentNavBar({
  path,
  userId,
  firstName,
  lastName,
  profilePicture,
}: StudentNavbarProps) {
  const [fName, setFName] = useState(firstName || null);
  const [lName, setLName] = useState(lastName || null);
  const [avatarUrl, setAvatarUrl] = useState(profilePicture || null);
  const [uid, setUid] = useState(userId);

  useEffect(() => {
    // If we already have the data from props, don't fetch
    if (firstName && lastName && profilePicture && userId) return;

    const getCookie = (name: string) => {
      const match = document.cookie
        .split("; ")
        .find((c) => c.startsWith(name + "="));
      return match ? decodeURIComponent(match.split("=")[1]) : null;
    };

    const acc = getCookie("account_number");
    if (acc) {
      if (!userId) setUid(Number(acc));
      
      // Fetch profile data to get avatar
      fetch(`/api/student/profile/${acc}`)
        .then((res) => res.json())
        .then((data) => {
          if (!firstName) setFName(data.first_name);
          if (!lastName) setLName(data.last_name);
          if (!profilePicture) setAvatarUrl(data.profile_picture);
        })
        .catch(console.error);
    }
  }, [firstName, lastName, profilePicture, userId]);

	return (
		<>
			{/* NAV BAR */}
			<header className="w-full bg-[#1C2632] text-m">
				<div className="max-w-7xl mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-10">
					<div className="flex items-center gap-4 md:gap-8">
						<Logo size={28} href="/" />

						<nav className="hidden md:flex items-center gap-4 border-l border-gray-700 pl-8 h-7 font-[family-name:var(--font-geist-sans)]">
							<Link href="/student" className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 transition-colors flex items-center h-full text-m leading-none rounded-full px-4 py-2">
								Dashboard
							</Link>
							<Link href="/student/browse" className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 transition-colors flex items-center h-full text-m leading-none rounded-full px-4 py-2">
								Browse
							</Link>
						</nav>
						
					</div>

				<div className="flex items-center gap-2 md:gap-4">
					<button 
						suppressHydrationWarning
						className="flex items-center justify-center text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 transition-colors rounded-full p-2"
						aria-label="Notifications"
						>
							<Bell className="h-6 w-6" strokeWidth={2} />
					</button>

          <div className="py-2">
            <Avatar
              firstName={fName}
              lastName={lName}
              profilePicture={avatarUrl}
              size={32}
              href={uid ? `/student/profile/${uid}` : "#"}
            />
          </div>
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
