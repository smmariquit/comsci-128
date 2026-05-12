"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const routeNames: Record<string, string> = {
  accommodations: "Accommodations",
  applications: "Applications",
  profile: "Profile",
  assignment: "Assignment",
  issues: "Issues",
  occupants: "Occupants",
};

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  
  if (segments.length === 1 && segments[0] === "manage") {
    return (
      <div className="flex items-center text-[#EDE9DE] text-[13px] font-sans font-regular">
        <span>Dashboard</span>
      </div>
    );
  }
  
  if (segments[0] !== "manage") {
    return null;
  }
  
  const breadcrumbs = [];
  
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const href = "/" + segments.slice(0, i + 1).join("/");
    const isLast = i === segments.length - 1;
    
    let name = routeNames[segment] || segment;
    
    if (!isNaN(Number(segment))) {
      name = `ID: ${segment}`;
    }
    
    breadcrumbs.push({ href, name, isLast });
  }

  return (
    <div className="flex items-center gap-1 text-[#EDE9DE] text-[13px] font-sans font-regular">
      <Link href="/manage" className="hover:underline py-4">Dashboard</Link>
      {breadcrumbs.map((crumb) => (
        <div key={crumb.href} className="flex items-center gap-1">
          <ChevronRight size={14} className="text-[#EDE9DE]/70" />
          {crumb.isLast ? (
            <span>{crumb.name}</span>
          ) : (
            <Link href={crumb.href} className="hover:underline py-4">{crumb.name}</Link>
          )}
        </div>
      ))}
    </div>
  );
}