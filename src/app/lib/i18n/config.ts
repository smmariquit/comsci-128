export const locales = ["en", "fil"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "NEXT_LOCALE";

export function isLocale(value: string | undefined | null): value is Locale {
  if (!value) return false;
  return locales.includes(value as Locale);
}
