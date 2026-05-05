"use client";

import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { setCookie } from "@/app/lib/utils";
import { localeCookieName, type Locale } from "@/app/lib/i18n/config";

const localeOptions: Array<{ value: Locale; labelKey: string }> = [
  { value: "en", labelKey: "english" },
  { value: "fil", labelKey: "filipino" },
];

export function LocaleSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    setCookie(localeCookieName, nextLocale, 365);
    router.refresh();
  }

  return (
    <div className="fixed right-4 top-4 z-50">
      <label className="sr-only" htmlFor="locale-switcher">
        {t("language")}
      </label>
      <select
        id="locale-switcher"
        aria-label={t("language")}
        className="rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm"
        value={locale}
        onChange={handleChange}
      >
        {localeOptions.map(option => (
          <option key={option.value} value={option.value}>
            {t(option.labelKey)}
          </option>
        ))}
      </select>
    </div>
  );
}
