import type { Metadata } from "next";
import AdminShell from "./components/AdminShell";

export const metadata: Metadata = {
  title: "Housing Administrator",
  description: "Housing Administrator Panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
