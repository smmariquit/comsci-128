import { supabase } from "@/lib/supabase"; 
import type { OccupancyReportRow, ApplicationReportRow } from "@/app/components/admin/reports/reportsmock";

async function getOccupancyReport(managedHousingIds: number[]): Promise<OccupancyReportRow[]> {
    const { data: rooms, error } = await supabase
        .from("room")
        .select(`
            room_id,
            room_code,
            room_type,           
            maximum_occupants,
            occupants_count,
            occupancy_status,    
            housing!inner ( housing_name )
        `)
        .in("housing_id", managedHousingIds)
        .eq("is_deleted", false);

    if (error) throw new Error("Failed to fetch occupancy report: " + error.message);

    return (rooms || []).map((room: any) => {
        const housingObj = Array.isArray(room.housing) ? room.housing[0] : room.housing;
        
        return {
            room_id: room.room_id,
            room_code: room.room_code?.toString() || "N/A",
            housing_name: housingObj?.housing_name || "Unknown Property",
            room_type: room.room_type, 
            maximum_occupants: room.maximum_occupants || 0,
            current_occupants: room.occupants_count || 0,
            occupancy_status: room.occupancy_status, 
        };
    });
}

async function getApplicationReport(managedHousingIds: number[]): Promise<ApplicationReportRow[]> {
    const { data: applications, error } = await supabase
        .from("application")
        .select(`
            application_id,
            housing_name,
            preferred_room_type,
            application_status,
            expected_moveout_date,
            actual_moveout_date,
            student!inner (
                student_number,
                user!inner (
                    first_name,
                    last_name
                )
            ),
            room!inner ( housing_id )
        `)
        .in("room.housing_id", managedHousingIds)
        .eq("is_deleted", false);

    if (error) throw new Error("Failed to fetch application report: " + error.message);

    return (applications || []).map((app: any) => {
        const studentObj = Array.isArray(app.student) ? app.student[0] : app.student;
        const userObj = Array.isArray(studentObj?.user) ? studentObj.user[0] : studentObj?.user;

        const firstName = userObj?.first_name || "";
        const lastName = userObj?.last_name || "";

        return {
            application_id: app.application_id,
            student_name: `${firstName} ${lastName}`.trim() || "Unknown Student",
            student_number: studentObj?.student_number?.toString() || "N/A",
            housing_name: app.housing_name || "Unknown Property",
            preferred_room_type: app.preferred_room_type,
            application_status: app.application_status,
            expected_moveout_date: app.expected_moveout_date,
            actual_moveout_date: app.actual_moveout_date || undefined,
        };
    });
}

export const reportData = {
    getOccupancyReport,
    getApplicationReport
};