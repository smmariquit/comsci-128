"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, ChevronRight, X } from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  read: boolean;
  time: string;
}

const READ_NOTIFS_STORAGE_KEY = "readNotificationsAdmin";

export default function AdminNotificationBell() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifList, setNotifList] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/audit-log");
        if (!response.ok) throw new Error("Failed to fetch audit logs");

        const data = await response.json();
        const rawLogs = (Array.isArray(data) ? data : data.data ?? [])
          .sort(
            (a: any, b: any) =>
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
          )
          .slice(0, 3);

        const savedRead = JSON.parse(
          localStorage.getItem(READ_NOTIFS_STORAGE_KEY) || "[]",
        ) as string[];

        const transformed: NotificationItem[] = rawLogs.map((log: any) => ({
          id: String(log.audit_id),
          title: log.action_type,
          body:
            log.audit_description ||
            `${log.user_name || "A user"} performed ${log.action_type}`,
          read: savedRead.includes(String(log.audit_id)),
          time: new Date(log.timestamp).toLocaleString("en-PH", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));

        setNotifList(transformed);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifList.filter((n) => !n.read).length;

  const markAllRead = () => {
    const ids = notifList.map((n) => n.id);
    localStorage.setItem(READ_NOTIFS_STORAGE_KEY, JSON.stringify(ids));
    setNotifList((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissNotif = (id: string) => {
    setNotifList((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setNotifOpen((o) => !o)}
          className="w-11 h-11 bg-[#1C2632] rounded-full flex items-center justify-center text-white hover:bg-[#C9642A] transition-colors duration-150 shrink-0"
          aria-label="Open notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9642A] rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#eef0f4]">
              {unreadCount}
            </span>
          )}
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-13 w-[320px] bg-white rounded-2xl shadow-xl border border-[#1C2632]/6 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#1C2632]/6">
              <h3 className="text-sm font-bold text-[#1C2632]">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-[#C9642A]/10 text-[#C9642A] text-[10px] font-semibold rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-[#1C2632]/40 hover:text-[#C9642A] transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-[#1C2632]/6">
              {notifList.length === 0 ? (
                <p className="text-center text-xs text-[#1C2632]/40 py-8">
                  You're all caught up!
                </p>
              ) : (
                notifList.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-5 py-3.5 group transition-colors ${n.read ? "" : "bg-[#C9642A]/3"}`}
                  >
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C9642A] mt-1.5 shrink-0" />
                    )}
                    <div className={`flex-1 ${n.read ? "pl-4.5" : ""}`}>
                      <p className="text-[13px] font-semibold text-[#1C2632]">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-[#1C2632]/50 mt-0.5">
                        {n.body}
                      </p>
                      <p className="text-[10px] text-[#1C2632]/30 mt-1">
                        {n.time}
                      </p>
                    </div>
                    <button
                      onClick={() => dismissNotif(n.id)}
                      className="text-[#1C2632]/20 hover:text-[#1C2632]/60 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                      aria-label="Dismiss notification"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="px-5 py-3 border-t border-[#1C2632]/6">
              <Link
                href="/admin/logs"
                onClick={() => setNotifOpen(false)}
                className="text-xs text-[#1C2632]/40 hover:text-[#C9642A] transition-colors flex items-center gap-1"
              >
                View all in audit logs <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        )}
      </div>

      {notifOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
      )}
    </>
  );
}
