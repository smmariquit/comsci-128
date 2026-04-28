import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing",
  description: "View, manage, and issue billings for users under managed properties.",
};

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
