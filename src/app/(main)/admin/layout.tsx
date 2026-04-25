import type { Metadata } from "next";
import PageHeader from "@/app/components/admin/pageheader";
import Sidebar from "@/app/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "#eef0f4",
      }}
    >
      <Sidebar userInitials="JD" userName="John Doe" userRole="House Admin" />

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <PageHeader />

        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
