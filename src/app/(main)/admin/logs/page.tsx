import Sidebar from "@/app/components/admin/sidebar";
import PageHeader from "@/app/components/admin/pageheader";

export default function Page() {
  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", background: "#eef0f4" }}>
      <Sidebar
        userInitials="JD"
        userName="John Doe"
        userRole="House Admin"
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <PageHeader title="Dashboard" />

        {/* Content area — add your widgets/cards here */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
          {/* content goes here */}
        </div>
      </main>
    </div>
  );
}