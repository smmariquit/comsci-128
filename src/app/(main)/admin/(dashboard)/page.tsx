import type { Metadata } from "next";
import ActiveUsers from "@/app/components/admin/dashboard/activeusers";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};
import OccupancyChart from "@/app/components/admin/dashboard/occupancy_chart";
import RecentApplications from "@/app/components/admin/dashboard/recent_applications";
import RecentAuditLog from "@/app/components/admin/dashboard/recent_audit";
import StatCard from "@/app/components/admin/dashboard/stat_card";
import StudentHousingStatus from "@/app/components/admin/dashboard/student_housing_status";

import { getHousingAdmingDashboardData } from "@/app/lib/data/dashboard-data";
import { cookies } from "next/headers";

const recentAuditData = [
  {
    audit_id: 501,
    action_type: "Create",
    audit_description: "Created housing profile for Maple Dorm Annex.",
    user_name: "Justine Ivanne",
    timestamp: "2026-03-29 09:14 AM",
  },
  {
    audit_id: 502,
    action_type: "Update",
    audit_description: "Updated room capacity in Raymundo Residence Hall.",
    user_name: "House Admin",
    timestamp: "2026-03-29 09:32 AM",
  },
  {
    audit_id: 503,
    action_type: "Login",
    audit_description: "Admin signed in to dashboard.",
    user_name: "System",
    timestamp: "2026-03-29 10:02 AM",
  },
  {
    audit_id: 504,
    action_type: "Delete",
    audit_description: "Archived inactive housing listing (ID: H-019).",
    user_name: "House Admin",
    timestamp: "2026-03-29 10:21 AM",
  },
];

const activeUserData = [
  { label: "Students", count: 812 },
  { label: "Managers", count: 18 },
  { label: "Landlords", count: 26 },
  { label: "Admins", count: 5 },
];

const totalActiveUsers = activeUserData.reduce((sum, row) => sum + row.count, 0);

export default async function Page() {
  const storedCookie = await cookies();

  const adminId = Number(storedCookie.get("account_number")?.value ?? "0");
  const liveData = await getHousingAdmingDashboardData(adminId);

  const housingStatusData = [
    { label: "Assigned", count: liveData.housingStatusCounts.assigned, color: "#1D9E75" },
    { label: "Unassigned", count: liveData.housingStatusCounts.unassigned, color: "#6B7280"},
  ];
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
        }}
      >
        <StatCard label="Total Students" value={liveData.totalStudents.toString()} delta={0} deltaSub="Live Students" />
        <StatCard label="Occupancy Rate" value={`${liveData.occupancyRate}%`} delta={0} deltaSub="Live Occupancy Rate" />
        <StatCard label="Pending Applications" value={liveData.totalPendingApplication.toString()} delta={0} deltaSub="Pending Applications" />
        <StatCard label="Active Accommodations" value={liveData.activeAccommodations.toString()} delta={0} deltaSub="Currently accommodated" />
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 16,
          alignItems: "start",
        }}
      >
        <OccupancyChart data={liveData.occupancyData} />
        <StudentHousingStatus data={housingStatusData} />
        <ActiveUsers 
          data={[
            { label: "Students", count: liveData.totalStudents },
          ]} 
          total={totalActiveUsers} />
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, alignItems: "start" }}>
        <RecentApplications data={liveData.recentApplications} />
        <RecentAuditLog data={recentAuditData} />
      </section>
    </div>
  );
}
