import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Logs",
  description: "View system-wide audit logs for all users and admin actions and activities.",
};

export default function SysLogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
