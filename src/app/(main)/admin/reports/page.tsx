import ReportsWrapper from "@/app/components/admin/reports/reports_wrapper";
import { reportData } from "@/app/lib/data/report-data";
import { report } from "process";

export default async function ReportsPage() {
  // TODO: Replace with the actual logged-in admin's managed IDs 
  const managedHousingIds = [3, 12, 13, 14, 16, 18];

  // server-side fetch
  const [liveOccupancy, liveApplications, liveAccommodationHistory] = await Promise.all([
    reportData.getOccupancyReport(managedHousingIds),
    reportData.getApplicationReport(managedHousingIds),
    reportData.getAccommodationHistoryReport(managedHousingIds)
  ]);

  return (
    <ReportsWrapper
      liveOccupancy={liveOccupancy}
      liveApplications={liveApplications}
      liveAccommodationHistory={liveAccommodationHistory}
    />
  );
}