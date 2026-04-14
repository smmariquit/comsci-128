import { supabase } from "@/lib/supabase"; 
import type { OccupancyReportRow } from "@/app/components/admin/reports/reportsmock";

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

export const reportData = {
    getOccupancyReport,
};