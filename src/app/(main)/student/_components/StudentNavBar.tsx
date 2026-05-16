"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import Logo from "@/app/components/Logo";
import { useState, useEffect, useRef } from "react";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Approved": return "text-green-500";
    case "Rejected": return "text-red-500";
    case "Pending Manager Approval": return "text-yellow-500";
    case "Pending Admin Approval": return "text-orange-500";
    case "Cancelled": return "text-gray-500";
    default: return "text-gray-400";
  }
};

export default function StudentNavBar({ path, userId, userName }: StudentNavbarProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/notifications?accountNumber=${userId}`);
      const data = await res.json();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBellClick = () => {
    setIsNotifOpen(!isNotifOpen);
    if (!isNotifOpen) fetchNotifications();
  };

  return (
    <>
      <header className="w-full bg-[#1C2632] text-m">
        <div className="max-w-7xl mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-10">
          <div className="flex items-center gap-4 md:gap-8">
            <Logo size={28} href="/" />
            <nav className="hidden md:flex items-center gap-6 border-l border-gray-700 pl-8 font-[family-name:var(--font-geist-sans)]">
              <a href="/student" className="text-[#EDE9DE] hover:opacity-80 transition-opacity">Dashboard</a>
              <a href="/student/browse" className="text-[#EDE9DE] hover:opacity-80 transition-opacity">Browse</a>
              <a href="/student/complaints" className="text-[#EDE9DE] hover:opacity-80 transition-opacity">Complaints</a>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* Bell Button with Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleBellClick}
                className="text-[#EDE9DE] hover:opacity-80 transition-opacity"
              >
                <Bell className="h-6 w-6" strokeWidth={2} />
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-bold text-[#1C2632]">Application Updates</p>
                  </div>

                  {isLoading ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">Loading...</div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-gray-400">No notifications yet.</div>
                  ) : (
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.application_id} className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
                          <p className="text-sm font-medium text-[#1C2632] truncate">{notif.housing_name}</p>
                          <p className={`text-xs font-semibold mt-0.5 ${getStatusColor(notif.application_status)}`}>
                            {notif.application_status}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(notif.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link href={`/student/profile/${userId}`} className="flex items-center gap-3">
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

      <div className="w-full bg-[#567375] font-[family-name:var(--font-geist-sans)]">
        <div className="max-w-7xl mx-auto px-4 md:px-10 py-2 text-[#EDE9DE] text-[13px] font-sans font-regular">
          {path}
        </div>
      </div>
    </>
  );
}