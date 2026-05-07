"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

interface PageHeaderProps {
  title?: string;
  date?: string;
  onMenuClick?: () => void;
}

const routeTitleMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/accommodations": "Accommodations",
  "/admin/rooms": "Rooms",
  "/admin/billing": "Billing",
  "/admin/reports": "Reports",
  "/admin/logs": "Logs",
  "/admin/users": "Users",
};

function toTitleCaseFromPath(pathname: string) {
  const segment = pathname.split("/").filter(Boolean).pop();
  if (!segment || segment === "admin") return "Dashboard";

  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function PageHeader({
  title,
  date,
  onMenuClick,
}: PageHeaderProps) {
  const pathname = usePathname();

  const resolvedTitle =
    title ??
    routeTitleMap[pathname] ??
    (pathname.startsWith("/admin/")
      ? toTitleCaseFromPath(pathname)
      : "Dashboard");

  const formattedDate =
    date ??
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="border-b border-[#e2e5ea] px-4 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-6 md:px-8 md:pt-7">
      <div className="mb-1 flex items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#d4d9e2] text-[#1C2632] md:hidden"
          onClick={onMenuClick}
        >
          <Menu size={18} />
        </button>
        <h1 className="m-0 text-[22px] font-bold leading-tight text-[#1C2632] sm:text-[24px] md:text-[26px]">
          {resolvedTitle}
        </h1>
      </div>
      <p className="m-0 text-[11px] tracking-[0.02em] text-[#9aa3b0]">
        {formattedDate}
      </p>
    </div>
  );
}
