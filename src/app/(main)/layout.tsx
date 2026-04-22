import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Main",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}
