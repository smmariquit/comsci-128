"use client";

import { useEffect, useRef } from "react";

type LogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: LogoutModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm Logout"
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
        outline: "none",
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
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>
          Confirm Logout
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#567375",
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          Are you sure you want to log out of your session?
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          {/* Cancel */}
          <button
            disabled={isLoading}
            onClick={onClose}
            className="rounded-lg"
            style={{
              border: "1px solid rgba(28,38,50,0.15)",
              background: "#fff",
              color: "#1C2632",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 13,
              fontWeight: 600,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            Cancel
          </button>

          {/* Confirm */}
          <button
            disabled={isLoading}
            onClick={onConfirm}
            className="rounded-lg"
            style={{
              border: "none",
              background: "#C9642A",
              color: "#fff",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
              fontWeight: 700,
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>
  );
}
