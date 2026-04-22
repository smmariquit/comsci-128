import { supabase } from "@/lib/supabase"; 
import type { OccupancyReportRow, ApplicationReportRow, AccommodationHistoryRow, RevenueReportRow } from "@/app/components/admin/reports/reportsmock";

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

async function getAccommodationHistoryReport(managedHousingIds: number[]): Promise<AccommodationHistoryRow[]> {
    const { data: histories, error } = await supabase
        .from("student_accommodation_history")
        .select(`
            account_number,
            movein_date,
            moveout_date,
            student!inner (
                student_number,
                user!inner (
                    first_name,
                    last_name
                )
            ),
            room!inner (
                room_id,
                room_code,
                room_type,
                housing!inner ( housing_name )
            )
        `)
        .in("room.housing_id", managedHousingIds);

    if (error) throw new Error("Failed to fetch accommodation history: " + error.message);

    return (histories || []).map((history: any) => {
        const studentObj = Array.isArray(history.student) ? history.student[0] : history.student;
        const userObj = Array.isArray(studentObj?.user) ? studentObj.user[0] : studentObj?.user;
        const roomObj = Array.isArray(history.room) ? history.room[0] : history.room;
        const housingObj = Array.isArray(roomObj?.housing) ? roomObj.housing[0] : roomObj?.housing;

        const firstName = userObj?.first_name || "";
        const lastName = userObj?.last_name || "";

        // Fallback for active tenants: If no moveout date, use today to calculate "stay so far"
        const effectiveMoveoutDate = history.moveout_date || new Date().toISOString();

        return {
            account_number: history.account_number,
            student_name: `${firstName} ${lastName}`.trim() || "Unknown Student",
            student_number: studentObj?.student_number?.toString() || "N/A",
            room_id: roomObj?.room_id,
            room_code: roomObj?.room_code?.toString() || "N/A",
            housing_name: housingObj?.housing_name || "Unknown Property",
            room_type: roomObj?.room_type, 
            movein_date: history.movein_date,
            moveout_date: effectiveMoveoutDate,
        };
    });
}

async function getRevenueReport(managedHousingIds: number[]): Promise<RevenueReportRow[]> {
    const { data: bills, error } = await supabase
        .from("bill")
        .select(`
            transaction_id,
            amount,
            status,
            due_date,
            date_paid,
            bill_type,
            issue_date,
            student!inner (
                user!inner ( first_name, last_name )
            ),
            room!inner (
                housing!inner ( housing_name, housing_id )
            )
        `)
        .in("room.housing_id", managedHousingIds);
    
    if (error) throw new Error("Failed to fetch revenue report: " + error.message);
    
    return (bills || []).map((bill: any) => {
        const studentObj = Array.isArray(bill.student) ? bill.student[0] : bill.student;
        const userObj = Array.isArray(studentObj?.user) ? studentObj.user[0] : studentObj?.user;
        const roomObj = Array.isArray(bill.room) ? bill.room[0] : bill.room;
        const housingObj = Array.isArray(roomObj?.housing) ? roomObj.housing[0] : roomObj?.housing;

        return {
            transaction_id: bill.transaction_id,
            student_name: `${userObj?.first_name || ""} ${userObj?.last_name || ""}`.trim() || "Unknown Student",
            housing_name: housingObj.housing_name || "Unknown Property",
            amount: Number(bill.amount) || 0,
            status: bill.status,
            due_date: bill.due_date,
            date_paid: bill.date_paid || undefined,
            bill_type: bill.bill_type || "N/A",
            issue_date: bill.issue_date,
        };
    });
}

export const reportData = {
    getOccupancyReport,
    getApplicationReport,
    getAccommodationHistoryReport,
    getRevenueReport,
};