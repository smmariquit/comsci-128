import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Administrator",
  description: "System Administrator panel for the CASA system.",
};

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <main>{children}</main>
    </div>
  );
}
