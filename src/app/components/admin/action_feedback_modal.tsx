"use client";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { C } from "@/lib/palette";

export type ActionFeedbackKind = "success" | "error";

export interface ActionFeedbackState {
  open: boolean;
  kind: ActionFeedbackKind;
  title: string;
  message: string;
}

export function ActionFeedbackModal({
  state,
  onClose,
}: {
  state: ActionFeedbackState | null;
  onClose: () => void;
}) {
  if (!state?.open) return null;

  const isSuccess = state.kind === "success";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(28,38,50,0.48)",
        backdropFilter: "blur(3px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 18,
          background: "#fff",
          outline: `1px solid ${C.cream}`,
          boxShadow: "0 26px 60px rgba(28,38,50,0.28)",
          overflow: "hidden",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            padding: "20px 22px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            background: isSuccess
              ? "linear-gradient(135deg, rgba(86,115,117,0.12), rgba(237,233,222,0.96))"
              : "linear-gradient(135deg, rgba(201,100,42,0.10), rgba(237,233,222,0.96))",
            borderBottom: `1px solid ${C.dividerLight}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: isSuccess ? "rgba(86,115,117,0.14)" : "rgba(201,100,42,0.14)",
                color: isSuccess ? C.teal : C.orange,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isSuccess ? <CheckCircle2 size={22} strokeWidth={2.2} /> : <AlertTriangle size={22} strokeWidth={2.2} />}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: C.navy, lineHeight: 1.1 }}>
                {state.title}
              </div>
              <div style={{ marginTop: 3, fontSize: 11, color: C.teal }}>
                {isSuccess ? "Action completed" : "Action failed"}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close result dialog"
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              border: `1px solid ${C.cream}`,
              background: "#fff",
              color: C.navy,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div style={{ padding: "18px 22px 22px" }}>
          <div style={{ fontSize: 13, color: C.navy, lineHeight: 1.6 }}>
            {state.message}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
            <button
              onClick={onClose}
              style={{
                padding: "9px 16px",
                borderRadius: 9,
                border: "none",
                background: isSuccess ? C.teal : C.orange,
                color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}