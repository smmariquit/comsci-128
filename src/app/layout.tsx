import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LocaleSwitcher } from "@/app/components/locale-switcher";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UPLB CASA",
    template: "%s | UPLB CASA",
  },
  description:
    "UPLB Centralized Accommodation System Application – find and manage student housing near UPLB.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LocaleSwitcher />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
