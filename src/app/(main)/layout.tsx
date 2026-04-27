import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Main",
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
