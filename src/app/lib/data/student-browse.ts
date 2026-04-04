import { supabase } from "@/app/lib/supabase";

interface FilterOptions {
    housing_type?: "UP Housing" | "Non-UP Housing";
    // TODO: filtering by sex (not yet implemented in the database)
    // sex?: "Male" | "Female" | "Co-ed";
    sort_by_price?: "asc" | "desc";
}

export async function getAllAvailableDorms(filters?: FilterOptions) {
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

        // optional filter implementation
        let filteredDorms = dorms;
        
        if (filters?.housing_type) {
            filteredDorms = filteredDorms.filter(
                (dorm) => dorm.housing_type === filters.housing_type
            );
        }

        // if (filters?.sex){
        //     filteredDorms = filteredDorms.filter(
        //         (dorm) => dorm.sex == filters.sex
        //     );
        // }

        if (filters?.sort_by_price) {
            filteredDorms.sort((a, b) => {
                if (filters.sort_by_price === "asc") {
                    return a.rent_price - b.rent_price;
                } else {
                    return b.rent_price - a.rent_price;
                }
            });
        }


        return filteredDorms;

    } catch (error: any) {
        console.error("Error fetching dorms:", error);
        throw new Error(error.message);
    }
}