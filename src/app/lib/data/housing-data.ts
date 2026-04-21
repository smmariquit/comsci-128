import { supabase } from "@/lib/supabase";
import type {
  Housing,
  HousingInsert,
  HousingUpdate,
  HousingWithRooms,
} from "@/models/housing";

const TODAY = new Date().toISOString();

// Inserts a new record and returns the created object with its new ID
async function create(housingDetails: HousingInsert): Promise<Housing | null> {
  const { data: newRecord, error } = await supabase
    .from("housing")
    .insert(housingDetails)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return newRecord;
}

// Fetches all active dorms, sorted alphabetically
async function findAll(): Promise<Housing[] | []> {
  const { data, error } = await supabase
    .from("housing")
    .select("*")
    .eq("is_deleted", false)
    .order("housing_name", { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function findWithRooms(id: number): Promise<HousingWithRooms> {
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
async function findById(id: number): Promise<Housing | null> {
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

async function update(
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
async function deactivate(housingId: number): Promise<Housing | null> {
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

// List all rooms 

async function findAllWithRooms(): Promise<HousingWithRooms[]> {
  const { data, error } = await supabase
    .from("housing")
    .select(`*, room:room(*)`)
    .eq("is_deleted", false)
	// .eq("manager_account_number", managerAccountNumber) TODO: revisit when manager account numbers are clarified ?
    .order("housing_name", { ascending: true })

  if (error) throw new Error(error.message)

  return (data ?? []).map((h) => ({
    ...h,
    room: h.room?.filter((r: any) => !r.is_deleted) ?? [],
  }))
}

export const housingData = {
	create,
	findAll,
	findById,
	findWithRooms,
	findAllWithRooms,
	update,
	deactivate,
  countAllHousing,
	getStudentsHoused,
  getHousingDetailsOfStudent.
  getRoomDetails,
  getOverallUnpaidFees,
  getOccupancyRate
};
