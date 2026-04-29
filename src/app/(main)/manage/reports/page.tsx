import type { Metadata } from "next";
import ReportsWrapper from "@/app/components/admin/reports/reports_wrapper";
import { reportData } from "@/app/lib/data/report-data";

export const metadata: Metadata = {
  title: "Manager Reports",
  description:
    "View and generate reports related to occupancy, applications, revenue, and accommodation history for your assigned dormitories.",
};

export default async function ManagerReportsPage() {
  // TODO: Replace with the actual logged-in manager's assigned IDs
  const assignedHousingIds = [3]; // e.g., manages only Dormitory 3

  // Server-side fetch from the mock database module
  const [liveOccupancy, liveApplications, liveAccommodationHistory] =
    await Promise.all([
      reportData.getOccupancyReport(assignedHousingIds),
      reportData.getApplicationReport(assignedHousingIds),
      reportData.getAccommodationHistoryReport(assignedHousingIds),
    ]);

  return (
    <div className="p-8">
      <div className="mb-6 px-6">
        <h1 className="text-3xl font-bold text-white mb-2">Dormitory Reports</h1>
        <p className="text-white/60">Generate and export reports for your assigned accommodations.</p>
      </div>
      <ReportsWrapper
        liveOccupancy={liveOccupancy}
        liveApplications={liveApplications}
        liveAccommodationHistory={liveAccommodationHistory}
      />
    </div>
  );
}
