import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Accounts",
  description: "Manage all user accounts registed in the UPLB CASA system.",
};

export default function SysUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
