"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { C } from "@/lib/palette";

function Backdrop({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(28,38,50,0.45)",
        zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function ModalShell({
  title, sub, onClose, children, footer,
}: {
  title: string; sub?: string; onClose: () => void;
  children: React.ReactNode; footer: React.ReactNode;
}) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, width: 500, maxWidth: "92vw",
      outline: `1px solid ${C.cream}`, fontFamily: "'DM Sans', sans-serif", overflow: "hidden",
    }}>
      <div style={{
        padding: "20px 24px 16px", borderBottom: `1px solid ${C.dividerLight}`,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>{title}</div>
          {sub && (
            <div style={{ fontSize: 11, color: C.teal, fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
              {sub}
            </div>
          )}
        </div>
        {/* ✅ aria-label gives the icon-only button a discernible name */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            background: C.cream, border: "none", borderRadius: 8,
            width: 30, height: 30, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={14} color={C.teal} strokeWidth={2.5} aria-hidden="true" />
        </button>
      </div>
      <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
      <div style={{
        padding: "16px 24px", borderTop: `1px solid ${C.dividerLight}`,
        display: "flex", justifyContent: "flex-end", gap: 10,
      }}>
        {footer}
      </div>
    </div>
  );
}

function CancelBtn({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
        padding: "9px 20px", borderRadius: 9, border: `1px solid ${C.cream}`,
        background: "#fff", color: C.navy, cursor: "pointer",
      }}
    >
      Cancel
    </button>
  );
}

function PrimaryBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
        padding: "9px 20px", borderRadius: 9, border: "none",
        background: C.orange, color: "#fff", cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "11px 0", borderBottom: `1px solid ${C.dividerLight}`,
    }}>
      <span style={{
        fontSize: 10.5, fontFamily: "'DM Mono', monospace", fontWeight: 500,
        color: C.teal, textTransform: "uppercase", letterSpacing: 0.8,
      }}>
        {label}
      </span>
      <span style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: C.navy }}>
        {value}
      </span>
    </div>
  );
}
