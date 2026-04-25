import type { Metadata } from "next";
import PageHeader from "@/app/components/admin/pageheader";
import Sidebar from "@/app/components/admin/sidebar";
import { createSupabaseServerClient } from "@/app/lib/server-client";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

function buildInitials(name: string) {
  const parts = name
    .split(" ")
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length === 0) return "HA";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  let sidebarUserName = "Housing Admin";
  let sidebarUserRole = "Housing Admin";
  let sidebarUserInitials = "HA";

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (authUser?.email) {
    const { data: userRow } = await supabase
      .from("user")
      .select("account_number, first_name, last_name, user_type")
      .eq("account_email", authUser.email)
      .maybeSingle();

    if (userRow) {
      const fullName = [userRow.first_name, userRow.last_name]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(" ");

      const { data: housingAdminRow } = await supabase
        .from("housing_admin")
        .select("account_number")
        .eq("account_number", userRow.account_number)
        .maybeSingle();

      sidebarUserName = fullName || authUser.email || sidebarUserName;
      sidebarUserRole = housingAdminRow ? "Housing Admin" : (userRow.user_type ?? "Housing Admin");
      sidebarUserInitials = buildInitials(sidebarUserName);
    }
  }

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
      <Sidebar
        userInitials={sidebarUserInitials}
        userName={sidebarUserName}
        userRole={sidebarUserRole}
      />

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
