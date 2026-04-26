import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Dashboard",
};

export default function SysDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
