import ActiveUsers from "@/app/components/admin/dashboard/activeusers";
import OccupancyChart from "@/app/components/admin/dashboard/occupancy_chart";
import RecentApplications from "@/app/components/admin/dashboard/recent_applications";
import RecentAuditLog from "@/app/components/admin/dashboard/recent_audit";
import StatCard from "@/app/components/admin/dashboard/stat_card";
import StudentHousingStatus from "@/app/components/admin/dashboard/student_housing_status";

import { getHousingAdmingDashboardData } from "@/app/lib/data/dashboard-data";

const occupancyData = [
  { room_type: "Single", occupied: 42, empty: 8 },
  { room_type: "Double", occupied: 58, empty: 12 },
  { room_type: "Triple", occupied: 24, empty: 6 },
  { room_type: "Quad", occupied: 14, empty: 10 },
];

const recentApplications = [
  {
    application_id: 1001,
    student_name: "Carla Reyes",
    housing_name: "Raymundo Residence Hall",
    preferred_room_type: "Double",
    expected_moveout_date: "2026-07-15",
    application_status: "Pending" as const,
  },
  {
    application_id: 1002,
    student_name: "Miguel Santos",
    housing_name: "Anos Garden Dormitory",
    preferred_room_type: "Single",
    expected_moveout_date: "2026-05-30",
    application_status: "Approved" as const,
  },
  {
    application_id: 1003,
    student_name: "Alyssa Dela Cruz",
    housing_name: "Batong Malake Subdivision",
    preferred_room_type: "Triple",
    expected_moveout_date: "2026-06-20",
    application_status: "Rejected" as const,
  },
  {
    application_id: 1004,
    student_name: "Noah Garcia",
    housing_name: "Raymundo Residence Hall",
    preferred_room_type: "Quad",
    expected_moveout_date: "2026-08-01",
    application_status: "Cancelled" as const,
  },
];

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

const housingStatusData = [
  { label: "Assigned", count: 182, color: "#1D9E75" },
  { label: "Pending Assignment", count: 41, color: "#D97706" },
  { label: "Waitlisted", count: 23, color: "#7C3AED" },
  { label: "Unassigned", count: 14, color: "#6B7280" },
];

const activeUserData = [
  { label: "Students", count: 812 },
  { label: "Managers", count: 18 },
  { label: "Landlords", count: 26 },
  { label: "Admins", count: 5 },
];

const totalActiveUsers = activeUserData.reduce((sum, row) => sum + row.count, 0);

export default async function Page() {
  const liveData = await getHousingAdmingDashboardData();
  // <StatCard label="Total Students" value="1,024" delta={24} deltaSub="vs last month" />
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
        <StatCard label="Active Accommodations" value="27" delta={2} deltaSub="new this month" />
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