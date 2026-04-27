import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dorm Management",
};

export default function DormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
