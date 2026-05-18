"use client";

import { usePathname } from "next/navigation";

interface PageHeaderProps {
  title?: string;
  date?: string;
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

import ThemeToggle from "@/app/components/ui/ThemeToggle";

// ... skipping to the export default function ...
export default function PageHeader({ title, date }: PageHeaderProps) {
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
    <div
      className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700"
      style={{
        padding: "28px 32px 20px",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div>
        <h1 className="text-[26px] font-bold text-[#1C2632] dark:text-[#EDE9DE] m-0 mb-1 leading-[1.2]">
          {resolvedTitle}
        </h1>
        <p className="text-[11px] text-[#9aa3b0] dark:text-[#9aa3b0]/80 m-0 tracking-[0.02em]">
          {formattedDate}
        </p>
      </div>
      <ThemeToggle className="text-[#1C2632] dark:text-[#EDE9DE] bg-gray-100 dark:bg-gray-800 p-2 rounded-xl" />
    </div>
  );
}
