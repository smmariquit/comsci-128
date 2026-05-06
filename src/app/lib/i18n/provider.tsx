"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import { type Locale, type TranslationDict, translations, LOCALE_LABELS } from "./translations";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "casa-locale";

function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "tl") return stored;
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // hydrate from localStorage after mount
  useEffect(() => {
    setLocaleState(getInitialLocale());
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = translations[locale];
      return dict[key] ?? fallback ?? key;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}

export { LOCALE_LABELS };
export type { Locale };
