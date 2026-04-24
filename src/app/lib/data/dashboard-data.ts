import { roomData } from "./room-data";
import { applicationData } from "./application-data";
import { housingData } from "./housing-data";
import { accommodationHistoryData } from "./accommodation-history-data";

export async function getHousingAdmingDashboardData(landlordId: number) {
    const managedHousings = await housingData.findbyLandlord(landlordId);

    const managedHousingIds = managedHousings.map(h => h.housing_id);
    
    const [allRooms, allApps, allTenants] = await Promise.all([
        roomData.findAllRoomDetailed(managedHousingIds),
        applicationData.getApplicationsWithStudentDetails(),
        accommodationHistoryData.getCurrentTenantsByHousingAdmin(managedHousingIds),
    ]);

    const filteredRooms = allRooms.filter(r => managedHousingIds.includes(r.housing_id));
    const filteredApps = allApps.filter(app => app.landlord_account_number === landlordId)

    const formattedApps = filteredApps.map((app: any) => {
        const studentObj = Array.isArray(app.student) ? app.student[0] : app.student;
        const userObj = Array.isArray(studentObj?.user) ? studentObj.user[0] : studentObj?.user;

        return {
            application_id: app.application_id,
            student_name: userObj
                ? `${userObj.first_name} ${userObj.last_name}`
                : "Unknown Student",
            housing_name: app.housing_name,
            preferred_room_type: app.preferred_room_type,
            expected_moveout_date: app.expected_moveout_date,
            application_status: app.application_status,
        }
    });

    const totalPendingApplication = filteredApps.filter(a => 
        a.application_status === "Pending Manager Approval" || 
        a.application_status === "Pending Admin Approval"
    ).length;

    const totalAcceptedApplication = filteredApps.filter(a =>
        a.application_status === "Approved"
    ).length;
    
    const totalCapacity = filteredRooms.reduce((sum, r) => sum + (r.maximum_occupants || 0), 0);
    const totalOccupied = filteredRooms.filter(r => r.occupancy_status !== "Empty").length;

    const occupancyRate = totalCapacity > 0
        ? Math.round((totalOccupied / totalCapacity) * 100)
        : 0;

    const occupancyData = ["Co-ed", "Women Only", "Men Only"].map(type => {
        const roomsType = filteredRooms.filter(r => r.room_type === type);

        return {
            room_type: type,
            occupied: roomsType.filter(r => r.occupancy_status !== "Empty").length,
            empty: roomsType.filter(r => r.occupancy_status === "Empty").length,
        }
    });

    const totalAssigned = totalAcceptedApplication;
    const totalUnassigned = totalPendingApplication;

    const totalCurrentTenants = allTenants.length;

    return {
        totalStudents: totalCurrentTenants,
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
   
