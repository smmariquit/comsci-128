"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BedDouble,
  Building2,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  ReceiptText,
  ScrollText,
  Users,
} from "lucide-react";
import NavItem from "@/app/components/admin/navitem";
import { getSupabaseBrowserClient } from "@/app/lib/browser-client";

// Home icon for logo
function HomeIcon() {
  return <Building2 size={20} color="white" strokeWidth={2.2} />;
}

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properties and Dorms", href: "/admin/accommodations", icon: Building2 },
  { label: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Billings", href: "/admin/billing", icon: ReceiptText },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Audit Logs", href: "/admin/logs", icon: ScrollText },
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      window.location.href = "/login";
    }
  };

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
          <HomeIcon />
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
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              isActive={isActive}
              icon={item.icon}
            />
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
          onClick={() => setMenuOpen((prev) => !prev)}
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
            background: menuOpen ? "rgba(237,233,222,0.07)" : "transparent",
            transition: "background 0.15s ease",
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
            <ChevronRight
              size={14}
              color="rgba(237,233,222,0.30)"
              strokeWidth={1.8}
              style={{
                transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </div>
        </div>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              bottom: "100%",
              left: 20,
              right: 10,
              marginBottom: 8,
              background: "#243447",
              borderRadius: 10,
              overflow: "hidden",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <button
              onClick={() => {
                setMenuOpen(false);
                setLogoutModalOpen(true);
              }}
              style={{
                width: "100%",
                border: "none",
                background: "transparent",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 14px",
                color: "#f87171",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>

      {logoutModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(17, 24, 39, 0.45)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 360,
              background: "#ffffff",
              borderRadius: 12,
              border: "1px solid rgba(28,38,50,0.10)",
              boxShadow: "0 16px 40px rgba(17,24,39,0.25)",
              padding: 20,
              color: "#1C2632",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Confirm Logout</div>
            <div style={{ fontSize: 13, color: "#567375", lineHeight: 1.5, marginBottom: 16 }}>
              Are you sure you want to log out of your Housing Admin session?
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button
                disabled={isLoggingOut}
                onClick={() => setLogoutModalOpen(false)}
                style={{
                  border: "1px solid rgba(28,38,50,0.15)",
                  background: "#fff",
                  color: "#1C2632",
                  borderRadius: 8,
                  padding: "8px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: isLoggingOut ? "not-allowed" : "pointer",
                  opacity: isLoggingOut ? 0.6 : 1,
                }}
              >
                Cancel
              </button>
              <button
                disabled={isLoggingOut}
                onClick={handleLogout}
                style={{
                  border: "none",
                  background: "#C9642A",
                  color: "#fff",
                  borderRadius: 8,
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: isLoggingOut ? "not-allowed" : "pointer",
                  opacity: isLoggingOut ? 0.7 : 1,
                }}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}