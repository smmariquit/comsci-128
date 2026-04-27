import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Logs",
};

export default function SysLogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
