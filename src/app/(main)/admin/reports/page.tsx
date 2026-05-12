import type { Metadata } from "next";
import ReportsWrapper from "@/app/components/admin/reports/reports_wrapper";
import { reportData } from "@/app/lib/data/report-data";
import { housingData } from "@/app/lib/data/housing-data";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Reports",
  description:
    "View and generate reports related to occupancy, applications, revenue, and accommodation history for managed properties.",
};

export default async function ReportsPage() {
  const storedCookie = await cookies();
  const accountNumber = Number(storedCookie.get("account_number")?.value ?? "0");
  const housings = await housingData.findbyLandlord(accountNumber);
  const managedHousingIds = housings.map((h) => h.housing_id);

  // server-side fetch
  const [liveOccupancy, liveApplications, liveAccommodationHistory, liveRevenue] = await Promise.all([
    reportData.getOccupancyReport(managedHousingIds),
    reportData.getApplicationReport(managedHousingIds),
    reportData.getAccommodationHistoryReport(managedHousingIds),
    reportData.getRevenueReport(managedHousingIds),
  ]);

  return (
    <ReportsWrapper
      liveOccupancy={liveOccupancy}
      liveApplications={liveApplications}
      liveAccommodationHistory={liveAccommodationHistory}
      liveRevenue={liveRevenue}
    />
  );
}
