"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  ChevronRight,
  Home,
  DoorOpen,
  Users,
  Receipt,
  FileText,
  ClipboardList,
  X,
} from "lucide-react";
import Logo from "@/app/components/Logo";
import Avatar from "@/app/components/Avatar";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutGrid },
  { label: "Properties and Dorms", href: "/admin/accommodations", icon: Home },
  { label: "Rooms", href: "/admin/rooms", icon: DoorOpen },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Billings", href: "/admin/billing", icon: Receipt },
  { label: "Reports", href: "/admin/reports", icon: FileText },
  { label: "Audit Logs", href: "/admin/logs", icon: ClipboardList },
];

interface SidebarProps {
  userInitials?: string;
  userName?: string;
  userRole?: string;
  profilePicture?: string | null;
  onNavigate?: () => void;
}

export default function Sidebar({
  userInitials = "LF",
  userName = "Luthelle Fernandez",
  userRole = "System Admin",
  profilePicture = null,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "100%",
        minWidth: 0,
        maxWidth: 316,
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
          opacity: 0.4,
          pointerEvents: "none",
        }}
      />

      {/* ── Logo / Header ── */}
      <div
        style={{
          width: "100%",
          height: 132,
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
          position: "relative",
        }}
      >
        {onNavigate && (
          <button
            onClick={onNavigate}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "transparent",
              border: "none",
              color: "#EDE9DE",
              cursor: "pointer",
              zIndex: 10,
            }}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
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
            overflow: "hidden",
          }}
        >
          <Logo size={28} useWhiteIcon showText={false} href={null} />
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
            letterSpacing: 0.1,
            whiteSpace: "nowrap",
          }}
        >
          UPLB CASA
        </div>

        {/* Subtitle */}
        <div
          style={{
            position: "absolute",
            left: 82,
            top: 73,
            color: "#6E9092",
            fontSize: 13,
            fontWeight: 400,
          }}
        >
          Property Management
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav
        style={{
          width: "calc(100% - 42px)",
          marginLeft: 21,
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
              onClick={onNavigate}
              className="rounded-lg"
              style={{
                width: "100%",
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
                <item.icon
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
          width: "100%",
          height: 84,
          borderTop: "1px solid rgba(255,255,255,0.07)",
          flexShrink: 0,
          position: "relative",
        }}
      >
        <button
          className="rounded-lg text-left"
          type="button"
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
            background: "transparent",
            border: "none",
            padding: 0,
          }}
        >
          {/* Avatar */}
          <div style={{ marginLeft: 10, flexShrink: 0 }}>
            <Avatar
              firstName={userName.split(" ")[0]}
              lastName={userName.split(" ").slice(1).join(" ")}
              profilePicture={profilePicture}
              size={33}
            />
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
            <div style={{ color: "#6E9092", fontSize: 13, fontWeight: 400 }}>
              {userRole}
            </div>
          </div>
          {/* Chevron */}
          <div style={{ marginRight: 10 }}>
            <ChevronRight size={14} color="rgba(237,233,222,0.30)" />
          </div>
        </button>
      </div>
    </aside>
  );
}
