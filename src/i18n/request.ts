import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import {
  defaultLocale,
  isLocale,
  localeCookieName,
} from "@/app/lib/i18n/config";

export default getRequestConfig(async () => {
  const cookieLocale = cookies().get(localeCookieName)?.value;
  const locale = isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  const messages = (await import(
    `@/app/lib/i18n/messages/${locale}.json`
  )).default;

  return {
    locale,
    messages,
  };
});
