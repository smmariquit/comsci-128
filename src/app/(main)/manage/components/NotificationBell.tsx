"use client";

import { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { NotificationItem } from "@/app/lib/services/notification-service";

export default function NotificationBell({
  notifications,
}: {
  notifications: NotificationItem[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#EDE9DE] hover:bg-white/10 focus-visible:bg-white/10 transition-colors flex items-center justify-center rounded-full p-2 relative"
        aria-label="Notifications"
      >
        <Bell size={22} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden font-[family-name:var(--font-geist-sans)] text-black">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                <p>You're all caught up!</p>
                <p className="text-xs text-gray-400 mt-1">
                  No new pending actions.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notification) => (
                  <Link
                    key={notification.id}
                    href={notification.link}
                    onClick={() => setIsOpen(false)}
                    className="p-4 border-b border-gray-50 hover:bg-orange-50 transition-colors flex flex-col gap-1 last:border-0"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium text-sm text-[var(--dark-orange)]">
                        {notification.title}
                      </span>
                      <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {notification.description}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center">
              <span className="text-xs text-gray-500">
                Need manager review/actions
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
