import { supabase } from "@/app/lib/supabase";

interface FilterOptions {
  housing_type?: "UP Housing" | "Non-UP Housing";
  sex?: "Men Only" | "Women Only" | "Co-ed";
  sort_by_price?: "asc" | "desc";
  search?: string;
}

export async function getAllAvailableDorms(filters?: FilterOptions) {
  try {
    let roomQuery = supabase
      .from("room")
      .select("housing_id, room_type")
      .eq("is_deleted", false)
      .not("occupancy_status", "eq", "Fully Occupied");

    if (filters?.sex){
        roomQuery = roomQuery.eq("room_type", filters.sex);
    }

    const { data: rooms, error: roomError } = await roomQuery;

    if (roomError) throw roomError;

    if (!rooms || rooms.length === 0) {
      return [];
    }

    const housingIds = [...new Set(rooms.map((room) => room.housing_id))];

    let query = supabase
      .from("housing")
      .select("*")
      .in("housing_id", housingIds)
      .eq("is_deleted", false);

    if (filters?.search) {
      query = query.ilike("housing_name", `%${filters.search}%`);
    }

    if (filters?.housing_type) {
      query = query.eq("housing_type", filters.housing_type);
    }

    if (filters?.sort_by_price) {
      query = query.order("rent_price", { ascending: filters.sort_by_price === "asc" });
    }

    const { data: dorms, error: dormError } = await query;

    if (dormError) throw dormError;

    return dorms || [];
  } catch (error: any) {
    console.error("Error fetching dorms:", error);
    throw new Error(error.message);
  }
}
