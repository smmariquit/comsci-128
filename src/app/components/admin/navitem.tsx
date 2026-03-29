"use client";
 
import Link from "next/link";
import { useState } from "react";
import { GridIcon } from "./gridicon";
 
interface NavItemProps {
  label: string;
  href: string;
  isActive: boolean;
}
 
export default function NavItem({ label, href, isActive }: NavItemProps) {
  const [hovered, setHovered] = useState(false);
 
  let background = "transparent";
  if (isActive) background = "#A03A00";
  else if (hovered) background = "rgba(237,233,222,0.07)";
 
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
        textDecoration: "none",
        background,
        transition: "background 0.15s ease",
        cursor: "pointer",
      }}
    >
      {/* Icon */}
      <span style={{ position: "relative", left: 20, display: "flex", opacity: isActive || hovered ? 1 : 0.5 }}>
        <GridIcon active={isActive || hovered} />
      </span>
 
      {/* Label */}
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
    </Link>
  );
}
 