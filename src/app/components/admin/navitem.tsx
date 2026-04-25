"use client";
 
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, type LucideIcon } from "lucide-react";
 
interface NavItemProps {
  label: string;
  href: string;
  isActive: boolean;
  icon: LucideIcon;
}
 
export default function NavItem({ label, href, isActive, icon: Icon }: NavItemProps) {
  const [hovered, setHovered] = useState(false);
 
  let background = "transparent";
  if (isActive) background = "#A03A00";
  else if (hovered) background = "rgba(237,233,222,0.07)";

  const isHighlighted = isActive || hovered;
  const iconColor = isHighlighted ? "#EDE9DE" : "rgba(237,233,222,0.55)";
 
  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 274,
        height: 47,
        borderRadius: 9,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        textDecoration: "none",
        background,
        paddingRight: 12,
        transform: hovered && !isActive ? "translateX(2px)" : "translateX(0)",
        boxShadow: hovered && !isActive ? "inset 0 0 0 1px rgba(237,233,222,0.08)" : "none",
        transition: "all 0.15s ease",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span style={{ position: "relative", left: 20, display: "flex" }}>
          <Icon size={17} color={iconColor} strokeWidth={2} />
        </span>

        <span
          style={{
            position: "relative",
            left: 28,
            color: isActive ? "#EDE9DE" : hovered ? "rgba(237,233,222,0.85)" : "rgba(237,233,222,0.55)",
            fontSize: 13,
            fontWeight: isActive ? 500 : 400,
            transition: "color 0.15s ease",
          }}
        >
          {label}
        </span>
      </div>

      <ChevronRight
        size={14}
        color={isHighlighted ? "rgba(237,233,222,0.5)" : "rgba(237,233,222,0.22)"}
        strokeWidth={1.8}
      />
    </Link>
  );
}
 