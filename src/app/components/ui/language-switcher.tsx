"use client";

import { useI18n, LOCALE_LABELS, type Locale } from "@/app/lib/i18n";
import { Globe } from "lucide-react";

const locales: Locale[] = ["en", "tl"];

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {!compact && <Globe size={14} color="#8AABAC" strokeWidth={2} />}
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        aria-label="Language"
        style={{
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 6,
          color: "#EDE9DE",
          fontSize: 11,
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 500,
          padding: "4px 8px",
          cursor: "pointer",
          outline: "none",
        }}
      >
        {locales.map((l) => (
          <option key={l} value={l} style={{ background: "#1C2632", color: "#EDE9DE" }}>
            {LOCALE_LABELS[l]}
          </option>
        ))}
      </select>
    </div>
  );
}
