import type { Metadata } from "next";
import { cookies } from "next/headers";
import StudentNavBar from "@/app/(main)/student/_components/StudentNavBar";
import { getHousingStatus } from "@/app/lib/data/student-dashboard";
import { userData } from "@/app/lib/data/user-data";
import { getCompleteDashboardData } from "@/app/lib/services/student-dashboard.service";
import AssignedDashboard from "./_components/AssignedDashboard";
import NotAssignedDashboard from "./_components/NotAssignedDashboard";

export const metadata: Metadata = {
  title: "Student Dashboard",
};

export default async function DashboardPage() {
  const awaitCookie = await cookies();
  const getValue = awaitCookie.get("account_number")?.value;

  if (!getValue) return;
  const account_number = parseInt(getValue, 10);
  const currUser = await userData.findById(account_number);
  const userHousingStatus = await getHousingStatus(currUser?.account_number);
  const userHousingDetails = await getCompleteDashboardData(
    currUser?.account_number,
  );
  const userName = `${currUser?.first_name} ${currUser?.last_name}`;

  function DashboardContent(housing_status: string) {
    if (housing_status === "Assigned") {
      // user with assigned housing
      return AssignedDashboard(userName, userHousingDetails);
    }
    return NotAssignedDashboard(userName, userHousingDetails);
  }

  return (
    // MAIN PAGE
    <div className="w-full min-h-screen bg-[#EDE9DE] flex flex-col">
      {/* NAVBAR */}
      <StudentNavBar path={"Dashboard"} userId={currUser?.account_number} />

      {/* BODY */}
      <div className="w-full max-w-7xl mx-auto flex-1 px-4 md:px-9 py-4 flex flex-col justify-start items-center gap-4 overflow-hidden">
        {DashboardContent(userHousingStatus?.housing_status)}
      </div>
    </div>
  );
}
