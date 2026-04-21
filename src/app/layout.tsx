import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "UPLB CASA",
    template: "%s | UPLB CASA",
  },
  description:
    "UPLB Centralized Accommodation System Application – find and manage student housing near UPLB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
