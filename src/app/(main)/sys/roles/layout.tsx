import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Roles & Permissions",
  description: "Configure roles and access permissions for system users.",
};

export default function RolesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
