import { userData } from "./user-data";
import { roomData } from "./room-data";
import { applicationData } from "./application-data";
import RecentApplications from "@/app/components/admin/dashboard/recent_applications";

export async function getHousingAdmingDashboardData() {
    const [allStudents, allRooms, allApps] = await Promise.all([
        userData.findStudents(),
        roomData.findAllRoomDetailed(),
        applicationData.getApplicationsWithStudentDetails(),
    ]);

    const formattedApps = allApps.map((app: any) => ({
        application_id: app.application_id,
        student_name: app.student?.user
            ? `${app.student.user.first_name} ${app.student.user.last_name}`
            : "Unknown Student",
        housing_name: app.housing_name,
        preferred_room_type: app.preferred_room_type,
        expected_moveout_date: app.expected_moveout_date,
        application_status: app.application_status,
    }));

    const totalPendingApplication = allApps.filter(a => a.application_status === "Pending").length;
    const totalCapacity = allRooms.reduce((sum, r) => sum + (r.maximum_occupants || 0), 0);
    const totalOccupied = allRooms.filter(r => r.occupancy_status !== "Empty").length;

    const occupancyRate = totalCapacity > 0
        ? Math.round((totalOccupied / totalCapacity) * 100)
        : 0;

    const occupancyData = ["Single", "Double", "Shared"].map(type => {
        const roomsType = allRooms.filter(r => r.room_type === type);

        return {
            room_type: type,
            occupied: roomsType.filter(r => r.occupancy_status === "Partially Occupied" || r.occupancy_status === "Fully Occupied").length,
            empty: roomsType.filter(r => r.occupancy_status === "Empty").length,
        }
    });

    const studentStatusList = allStudents.map(u => u.student?.housing_status).filter(Boolean);
    const totalAssigned = studentStatusList.filter(s => s === "Assigned").length;
    const totalUnassigned = studentStatusList.filter(s => s === "Not Assigned" || s === "Vacated").length;

    return {
        totalStudents: allStudents.length,
        housingStatusCounts: {
            assigned: totalAssigned,
            unassigned: totalUnassigned,
        },
        occupancyRate: `${occupancyRate}`,
        totalPendingApplication,
        occupancyData: occupancyData,
        recentApplications: formattedApps
    }
}
   
