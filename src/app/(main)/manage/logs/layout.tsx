import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audit Logs",
  description: "Review audit logs for managed properties.",
};

export default function LogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
