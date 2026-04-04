import { supabase } from "@/app/lib/supabase";

export async function getAllAvailableDorms(){
    try{
        const { data: rooms, error: roomError } = await supabase
            .from("room")
            .select("housing_id")
            .eq("is_deleted", false)
            .not("occupancy_status", "eq", "Fully Occupied");

        if (roomError) throw roomError;

        if (!rooms || rooms.length === 0) {
            return [];
        }

        const housingIds = [...new Set(rooms.map((room) => room.housing_id))];

        const { data: dorms, error: dormError } = await supabase
            .from("housing")
            .select("*")
            .in("housing_id", housingIds)
            .eq("is_deleted", false);

        if (dormError) throw dormError;

        return dorms;

    } catch (error: any) {
        console.error("Error fetching dorms:", error);
        throw new Error(error.message);
    }
}