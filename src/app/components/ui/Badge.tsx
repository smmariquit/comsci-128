// src/app/components/ui/Badge.tsx

import React from "react";

interface BadgeProps {
  label: string;
  bg: string;
  text: string;
  dot?: string;
  uppercase?: boolean;
  mono?: boolean;
}

export function Badge({
  label,
  bg,
  text,
  dot,
  uppercase = false,
  mono = false,
}: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: bg,
        color: text,
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 20,
        whiteSpace: "nowrap",
        textTransform: uppercase ? "uppercase" : "none",
        fontFamily: mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: dot,
            flexShrink: 0,
          }}
        />
      )}
      {label}
    </span>
  );
}
