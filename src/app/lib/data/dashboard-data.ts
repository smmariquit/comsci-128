import { userData } from "./user-data";
import { roomData } from "./room-data";
import { getAllApplications } from "./application-data";
import { getAllBills } from "./housing-admin-data";
import RecentApplications from "@/app/components/admin/dashboard/recent_applications";

export async function getHousingAdmingDashboardData() {
    const allStudents = await userData.findStudent();
    const allRooms = await roomData.findAll();
    const allApps = await getAllApplications();
    const allBills = await getAllBills();

    const totalPendingApplication = allApps.filter(a => a.application_status === "Pending").length;
    const totalCapacity = allRooms.reduce((sum, r) => sum + (r.maximum_occupants || 0), 0);
    const totalOccupied = allRooms.filter(r => r.occupancy_status !== "Empty").length;

    const occupancyRate = totalCapacity > 0
        ? Math.round((totalOccupied / totalCapacity) * 100)
        : 0;

    const occupancyData = ["Single", "Double", "Shared"].map(type => ({
        room_type: type,
        occupied: allRooms.filter(r => r.room_type === type && r.occupancy_status !== "Empty").length,
        empty: allRooms.filter(r => r.room_type === type && r.occupancy_status === "Empty").length,

    }));

    return {
        totalStudents: allStudents.length,
        occupancyRate: `${occupancyRate}`,
        totalPendingApplication,
        occupancyData,
        RecentApplications: allApps.slice(0, 5)
    }
}
   
