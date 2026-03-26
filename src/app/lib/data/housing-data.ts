import { Housing, HousingInsert, HousingUpdate } from "@/models/housing";
import { supabase } from "@/lib/supabase";

// Define Housing record based on DB schema

// Inserts a new record and returns the created object with its new ID
export async function create(
	housingDetails: HousingInsert,
): Promise<Housing | null> {
	const { data: newRecord, error } = await supabase
		.from("housing")
		.insert(housingDetails)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return newRecord;
}

// Fetches all active dorms, sorted alphabetically
export async function findAll(): Promise<Housing[] | []> {
	const { data, error } = await supabase
		.from("housing")
		.select("*")
		.eq("is_deleted", false)
		.order("housing_name", { ascending: true });

	if (error) throw new Error(error.message);
	return data ?? [];
}

export async function findWithRooms(id: number) {
	const { data, error } = await supabase
		.from("housing")
		.select(
			`
			*,
			room:room(*)
		`,
		)
		.eq("housing_id", id)
		.eq("is_deleted", false)
		.single();

	if (error) throw new Error(error.message);
	//Filter deleted rooms
	data.room = data.room?.filter((room: any) => !room.is_deleted) ?? [];
	return data;
}

// Fetches a specific dorm by its unique ID
export async function findById(id: number): Promise<Housing | null> {
	const { data, error } = await supabase
		.from("housing")
		.select("*")
		.eq("housing_id", id)
		.eq("is_deleted", false)
		.single();

	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(error.message);
	}
	return data;
}

export async function update(
	housingId: number,
	housingDetails: Partial<HousingUpdate>,
): Promise<Housing | null> {
	const { data, error } = await supabase
		.from("housing")
		.update(housingDetails)
		.eq("housing_id", housingId)
		.select()
		.single();

	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(error.message);
	}

	return data;
}

//deletes a housing
export async function deactivate(housingId: number): Promise<Housing | null> {
	const { data, error } = await supabase
		.from("housing")
		.update({ is_deleted: true }) // Soft delete
		.eq("housing_id", housingId)
		.select()
		.single();

	if (error) {
		if (error.code === "PGRST116") return null;
		throw new Error(error.message);
	}

	return data;
}
