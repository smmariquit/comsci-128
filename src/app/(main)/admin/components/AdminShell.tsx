// src/app/(main)/admin/components/AdminShell.tsx

"use client";

import { useState } from "react";
import PageHeader from "@/app/components/admin/pageheader";
import Sidebar from "@/app/components/admin/sidebar";

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#eef0f4] md:flex">
      <div className="hidden md:block md:h-screen md:shrink-0">
        <Sidebar userInitials="JD" userName="John Doe" userRole="House Admin" />
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="relative h-full w-[86%] max-w-[320px]">
            <Sidebar
              userInitials="JD"
              userName="John Doe"
              userRole="House Admin"
              onNavigate={() => setIsSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <main className="flex min-h-screen flex-1 flex-col md:h-screen md:overflow-hidden">
        <PageHeader onMenuClick={() => setIsSidebarOpen(true)} />

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
