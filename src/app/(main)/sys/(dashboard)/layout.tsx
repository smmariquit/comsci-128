import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Dashboard",
  description: "System-wide overview of users, roles, and web-app activities.",
};

export default function SysDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
