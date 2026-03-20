import { Tables, TablesInsert, TablesUpdate } from "@/app/types/database.types";
import { supabase } from "@/lib/supabase";

// Define Housing record based on DB schema
export type Housing = Tables<"housing">;
export type HousingInsert = TablesInsert<"housing">;
export type HousingUpdate = TablesUpdate<"housing">;

// Inserts a new record and returns the created object with its new ID
export async function createHousing(data: Housing) {
	const { data: newRecord, error } = await supabase
		.from("housing")
		.insert(data)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return newRecord;
}

// Fetches all active dorms, sorted alphabetically
export async function getAllHousing() {
	const { data, error } = await supabase
		.from("housing")
		.select("*")
		.eq("is_deleted", false)
		.order("housing_name", { ascending: true });

	if (error) throw new Error(error.message);
	return data;
}

// Fetches a specific dorm by its unique ID
export async function getHousingById(id: string) {
	const { data, error } = await supabase
		.from("housing")
		.select("*")
		.eq("housing_id", id)
		.eq("is_deleted", false)
		.single();

	if (error) throw new Error(error.message);
	return data;
}
