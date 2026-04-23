import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Accounts",
};

export default function SysUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
