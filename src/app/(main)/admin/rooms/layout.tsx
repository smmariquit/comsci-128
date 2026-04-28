import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rooms",
  description: "Manage room listings, occupancy, and tenant assignments.",
};

export default function RoomsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
