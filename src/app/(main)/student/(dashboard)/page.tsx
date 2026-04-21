import Link from "next/link";
import { userData } from "@/app/lib/data/user-data";
import { getHousingStatus } from "@/app/lib/data/student-dashboard";
import { getCompleteDashboardData } from "@/app/lib/services/student-dashboard.service";
import StudentNavBar from "./_components/StudentNavBar";
import AssignedDashboard from "./_components/AssignedDashboard";
import NotAssignedDashboard from "./_components/NotAssignedDashboard";

export default async function DashboardPage() {
    const currUser = await userData.findById(21);
    const userHousingStatus = await getHousingStatus(currUser!.account_number);
    const userHousingDetails = await getCompleteDashboardData(currUser!.account_number);
    console.log(userHousingDetails);
    const userName = `${currUser?.first_name} ${currUser?.last_name}`;

    function DashboardContent(housing_status: String) {
        if(housing_status == "Assigned") { // user with assigned housing
            return AssignedDashboard(userName, userHousingDetails);
        }
        return NotAssignedDashboard(userName, userHousingDetails);
    }

    return (
        // MAIN PAGE
        <div style={{
            width: "100%",
            minHeight: "100%",
            background: "#1C2632",
            display: "inline-flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "stretch",
        }}>
            {/* NAVBAR */}
            <StudentNavBar
                path={"Dashboard"
                } />

            {/* BODY */}
            <div className="self-stretch flex-1 px-9 py-4 bg-stone-200 flex flex-col justify-start items-center gap-4 overflow-hidden">
                {DashboardContent(userHousingStatus?.housing_status)}
            </div>

        </div>
    );
}
