"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Home, ChevronRight } from "lucide-react";


const navItems = [
  { label: "Dashboard",            href: "/admin" },
  { label: "Properties and Dorms", href: "/admin/accommodations" },
  { label: "Rooms",                href: "/admin/rooms" },
  { label: "Users",                href: "/admin/users" },
  { label: "Billings",             href: "/admin/billing" },
  { label: "Reports",              href: "/admin/reports" },
  { label: "Audit Logs",           href: "/admin/logs" },
];

interface SidebarProps {
  userInitials?: string;
  userName?: string;
  userRole?: string;
}

export default function Sidebar({
  userInitials = "LF",
  userName = "Luthelle Fernandez",
  userRole = "System Admin",
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 316,
        minWidth: 316,
        height: "100vh",
        background: "#1C2632",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Decorative background circle */}
      <div
        style={{
          width: 200,
          height: 200,
          position: "absolute",
          left: 176,
          top: -60,
          borderRadius: "50%",
          background: "#2C3D54",
          opacity: 0.40,
          pointerEvents: "none",
        }}
      />

      {/* ── Logo / Header ── */}
      <div
        style={{
          width: 316,
          height: 132,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {/* Orange icon box */}
        <div
          style={{
            width: 38,
            height: 38,
            position: "absolute",
            left: 34,
            top: 50,
            background: "#C9642A",
            boxShadow: "0px 4px 12px rgba(201,100,42,0.35)",
            borderRadius: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Home size={20} color="white" />
        </div>

        {/* Brand name */}
        <div
          style={{
            position: "absolute",
            left: 82,
            top: 52,
            color: "#EDE9DE",
            fontSize: 24,
            fontWeight: 600,
            lineHeight: "16.8px",
            letterSpacing: 0.10,
          }}
        >
          HousingAdmin
        </div>

        {/* Subtitle */}
        <div
          style={{
            position: "absolute",
            left: 82,
            top: 73,
            color: "#6E9092",
            fontSize: 11,
            fontWeight: 400,
          }}
        >
          Property Management
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav
        style={{
          width: 274,
          marginLeft: 24,
          marginTop: 27,
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                width: 274,
                height: 47,
                borderRadius: 9,
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                background: isActive ? "#A03A00" : "transparent",
                transition: "background 0.15s",
              }}
            >
              {/* Icon */}
              <span
                style={{
                  position: "relative",
                  left: 20,
                  opacity: isActive ? 1 : 0.5,
                  display: "flex",
                }}
              >
                <LayoutGrid 
                  size={17} 
                  color={isActive ? "#EDE9DE" : "rgba(237, 233, 222, 0.55)"} 
                />
              </span>

              {/* Label */}
              <span
                style={{
                  position: "relative",
                  left: 28,
                  color: isActive ? "#EDE9DE" : "rgba(237,233,222,0.55)",
                  fontSize: 13,
                  fontWeight: isActive ? 500 : 400,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── User footer ── */}
      <div
        style={{
          width: 316,
          height: 84,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 286,
            height: 51,
            position: "absolute",
            left: 20,
            top: 13,
            borderRadius: 9,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 33,
              height: 33,
              marginLeft: 10,
              background: "#567375",
              borderRadius: "50%",
              outline: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#EDE9DE",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              {userInitials}
            </span>
          </div>

          {/* Name + role */}
          <div style={{ marginLeft: 10, flex: 1, overflow: "hidden" }}>
            <div
              style={{
                color: "#EDE9DE",
                fontSize: 13,
                fontWeight: 500,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </div>
            <div style={{ color: "#6E9092", fontSize: 11, fontWeight: 400 }}>
              {userRole}
            </div>
          </div>

          {/* Chevron */}
          <div style={{ marginRight: 10 }}>
            <ChevronRight size={14} color="rgba(237,233,222,0.30)" />
          </div>
        </div>
      </div>
    </aside>
  );
}