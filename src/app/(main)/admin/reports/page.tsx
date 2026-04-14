import ReportsWrapper from "@/app/components/admin/reports/reports_wrapper";
import { reportData } from "@/app/lib/data/report-data";

export default async function ReportsPage() {
  // TODO: Replace with the actual logged-in admin's managed IDs 
  const managedHousingIds = [3, 12, 13, 14, 16, 18];

  // server-side fetch
  const liveOccupancy = await reportData.getOccupancyReport(managedHousingIds);

  return <ReportsWrapper liveOccupancy={liveOccupancy} />;
}