import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "UPLB CASA | Find Your Home in Elbi",
    template: "%s | UPLB CASA",
  },
  description:
    "UPLB Centralized Accommodation System Application. Discover, manage, and secure safe student housing near the UPLB campus.",
  keywords: ["UPLB", "CASA", "Student Housing", "Dormitory", "Elbi", "Los Baños", "Accommodation"],
  authors: [{ name: "UPLB CMSC 128 Team" }],
  openGraph: {
    title: "UPLB CASA | Find Your Home in Elbi",
    description: "Discover, manage, and secure safe student housing near the UPLB campus with the Centralized Accommodation System.",
    url: "https://uplb.casa",
    siteName: "UPLB CASA",
    images: [
      {
        url: "/og-image.png", // We will generate this next!
        width: 1200,
        height: 630,
        alt: "UPLB CASA Preview",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UPLB CASA | Find Your Home in Elbi",
    description: "Discover, manage, and secure safe student housing near the UPLB campus.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  themeColor: "#C9642A", // The CASA brand orange
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
