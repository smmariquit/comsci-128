import type { Metadata } from "next";
import { cookies } from "next/headers";
import StudentNavBar from "@/app/(main)/student/_components/StudentNavBar";
import { getHousingStatus } from "@/app/lib/data/student-dashboard";
import { userData } from "@/app/lib/data/user-data";
import { getCompleteDashboardData } from "@/app/lib/services/student-dashboard.service";
import AssignedDashboard from "./_components/AssignedDashboard";
import NotAssignedDashboard from "./_components/NotAssignedDashboard";
import StateMessage from "@/app/components/ui/state-message";

export const metadata: Metadata = {
  title: "Student Dashboard",
};

export default async function DashboardPage() {
  const awaitCookie = await cookies();
  const getValue = awaitCookie.get("account_number")?.value;

  if (!getValue) {
    return (
      <StateMessage
        title="No student record found"
        description="We could not find your profile data yet."
      />
    );
  }

  const account_number = parseInt(getValue, 10);
  let currUser: Awaited<ReturnType<typeof userData.findById>> | null = null;
  let userHousingStatus: Awaited<ReturnType<typeof getHousingStatus>> | null =
    null;
  let userHousingDetails: Awaited<
    ReturnType<typeof getCompleteDashboardData>
  > | null = null;

  try {
    currUser = await userData.findById(account_number);
    if (!currUser) {
      return (
        <StateMessage
          title="No student record found"
          description="We could not find your profile data yet."
        />
      );
    }

    userHousingStatus = await getHousingStatus(currUser.account_number);
    userHousingDetails = await getCompleteDashboardData(
      currUser.account_number,
    );
  } catch (error) {
    return (
      <StateMessage
        variant="error"
        title="Unable to load dashboard"
        description="Please try again in a moment."
      />
    );
  }

  if (!userHousingDetails) {
    return (
      <StateMessage
        title="No dashboard data yet"
        description="Once your housing data is available, it will show here."
      />
    );
  }

  const userName = `${currUser.first_name} ${currUser.last_name}`;

  function DashboardContent(housing_status: string) {
    if (housing_status === "Assigned") {
      // user with assigned housing
      return AssignedDashboard(userName, userHousingDetails!);
    }
    return NotAssignedDashboard(userName, userHousingDetails!);
  }

  return (
    // MAIN PAGE
    <div className="w-full min-h-screen bg-[#EDE9DE] flex flex-col">
      {/* NAVBAR */}
      <StudentNavBar
        path={"Dashboard"}
        userId={currUser.account_number}
        userName={userName}
      />

      {/* BODY */}
      <div className="w-full max-w-7xl mx-auto flex-1 px-4 md:px-9 py-4 flex flex-col justify-start items-center gap-4 overflow-hidden">
        {DashboardContent(userHousingStatus?.housing_status)}
      </div>
    </div>
  );
}
