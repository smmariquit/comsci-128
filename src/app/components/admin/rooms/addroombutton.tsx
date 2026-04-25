"use client";

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
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...BTN_STYLE[variant],
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        padding: "4px 10px",
        borderRadius: 6,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
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