import {
	Housing,
	HousingInsert,
	HousingUpdate,
	HousingWithRooms,
} from "@/models/housing";
import { supabase } from "@/lib/supabase";

// Define Housing record based on DB schema

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

async function getHousingDetailsOfStudent(studentAccountNumber: number) {
	// get the details of the housing and room of a student given a student's account number
	
	const { data: studentHousingDetails, error } = await supabase
		.from("housing")
		.select(`
			*,
			room!inner(*),
			student_accommodation_history!inner(*)
		`)
		.eq("student_accommodation_history.account_number", studentAccountNumber);

	if (error) throw new Error(`getHousingDetailsofStudent Error: ${error.message}`);

	return studentHousingDetails;
}

async function getStudentsHousedPerHousing(managerId: number, housingId: number) {
  // get details of list of students housed per housing

  const { data, error } = await supabase
    .from("housing")
    .select(`
      *,
      room!inner(*),
      student_accommodation_history!inner(*),
      student!inner(*),
      user!inner(*)
    `)
    .eq("housing.housing_id", housingId)
    .eq("housing.manager_account_number", managerId);

  if (error) throw new Error(`getStudentsHousedPerHousing Error: ${error.message}`);
  return data;
}

export const housingData = {
	create,
	findAll,
	findById,
	findWithRooms,
	update,
	deactivate,
	getHousingDetailsOfStudent,
	getStudentsHousedPerHousing
};