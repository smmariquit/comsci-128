import { Housing, HousingInsert, HousingUpdate } from "@/models/housing";
import { supabase } from "@/lib/supabase";

// Define Housing record based on DB schema

// Inserts a new record and returns the created object with its new ID
export async function createHousing(data: Housing): Promise<Housing> {
	const { data: newRecord, error } = await supabase
		.from("housing")
		.insert(data)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return newRecord;
}

// Fetches all active dorms, sorted alphabetically
export async function findAllHousing(): Promise<Housing[]> {
	const { data, error } = await supabase
		.from("housing")
		.select("*")
		.eq("is_deleted", false)
		.order("housing_name", { ascending: true });

	if (error) throw new Error(error.message);
	return data ?? null;
}

// Fetches a specific dorm by its unique ID
export async function findHousingById(id: string) {
	const { data, error } = await supabase
		.from("housing")
		.select("*")
		.eq("housing_id", id)
		.eq("is_deleted", false)
		.maybeSingle();

	if (error) throw new Error(error.message);
	return data;
}

//deletes a housing 
export async function deleteHousing(housingId: number): Promise<Housing> {
    const { data, error } = await supabase
        .from("housing")
        .update({ is_deleted: true }) // Soft delete
        .eq("housing_id", housingId)
        .select()
        .maybeSingle();

    if (error) {
        console.error("Database Error (deleteHousing):", error.message);
        throw new Error(error.message);
    }

    return data;
}

export async function updateHousing(
	housingId: Number,
	housingDetails: Partial<Housing>,
) {
	const { data, error } = await supabase
		.from("housing")
		.update(housingDetails)
		.eq("housing_id", housingId)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}
