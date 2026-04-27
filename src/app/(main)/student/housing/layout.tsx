import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Housing",
};

export default function HousingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
