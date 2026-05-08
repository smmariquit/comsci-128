import type { Metadata } from "next";
import Breadcrumbs from "./components/Breadcrumbs";
import ManageTopNav from "./components/ManageTopNav";

export const metadata: Metadata = {
  title: "Manager Dashboard",
  description:
    "Manager panel for managing properties, applications, and tenants.",
};

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <ManageTopNav />

      {/* BREAD CRUMBS */}
      <div className="w-full bg-[#567375] font-[family-name:var(--font-geist-sans)]">
        <div className="flex items-center px-4 md:px-10 min-h-[44px] align-middle">
          <Breadcrumbs />
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-[var(--cream)]">{children}</main>

      {/* FOOTER */}
      <footer className="bg-[#1C2632] text-[#EDE9DE] px-6 py-10 text-sm">
        <div className="max-w-7xl mx-auto">© 2026 CMSC 128 Project</div>
      </footer>
    </div>
  );
}
