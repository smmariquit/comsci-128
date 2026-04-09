import Link from "next/link";
import { userData } from "@/app/lib/data/user-data";
import { getHousingStatus } from "@/app/lib/data/student-dashboard";
import StudentNavBar from "./_components/StudentNavBar";
import AssignedDashboard from "./_components/AssignedDashboard";
import NotAssignedDashboard from "./_components/NotAssignedDashboard";

export default async function DashboardPage() {
    const currUser = await userData.findById(21);
    const userHousingStatus = await getHousingStatus(currUser!.account_number);

    function DashboardContent(housing_status: String) {
        const userName = `${currUser?.first_name} ${currUser?.last_name}`;

        if(housing_status == "Assigned") { // user with assigned housing
            return AssignedDashboard(userName);
        }
        return NotAssignedDashboard(userName);
    }

	return (
        // MAIN PAGE
        <div className="w-[1440px] h-[900px] inline-flex flex-col justify-start items-start overflow-hidden">
            {/* NAVBAR */}
            <StudentNavBar 
                path={"Dashboard"
            }/>
            
            {/* BODY */}
            <div className="self-stretch flex-1 px-9 py-4 bg-stone-200 flex flex-col justify-start items-center gap-4 overflow-hidden">
                {DashboardContent(userHousingStatus?.housing_status)}
            </div>
            
        </div>
    );
}
