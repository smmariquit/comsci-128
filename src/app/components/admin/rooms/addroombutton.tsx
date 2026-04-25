"use client";

import { useState } from "react";
import { C } from "@/lib/palette";
type BtnVariant = "ghost" | "primary" | "danger" | "warn";

const BTN_STYLE: Record<BtnVariant, React.CSSProperties> = {
  ghost:   { background: "#fff", color: C.navy, border: `1px solid ${C.cream}` },
  primary: { background: C.orange, color: "#fff", border: "none" },
  danger:  { background: "rgba(201,100,42,0.10)", color: C.orange, border: `1px solid rgba(201,100,42,0.2)` },
  warn:    { background: "rgba(227,175,100,0.15)", color: "#A07820", border: `1px solid rgba(227,175,100,0.3)` },
};

function addRoomButton({ label, onClick, variant = "primary", disabled }: {
  label: string;
  onClick: () => void;
  variant?: BtnVariant;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={disabled}
      style={{
        ...BTN_STYLE[variant],
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        transform: hovered && !disabled ? "translateY(-1px)" : "translateY(0)",
        boxShadow: hovered && !disabled ? "0 6px 14px rgba(28,38,50,0.08)" : "none",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease",
      }}
    >
      {label}
    </button>
  );
}

function AddRoomButton({ onClick }: { onClick: () => void }) {
  return addRoomButton({ label: "Add Room", onClick, variant: "primary" });
}

// Add room button onclick handler example
function handleAddRoom() {
 
}