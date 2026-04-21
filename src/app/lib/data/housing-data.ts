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

async function getStudentsHoused(managerId: number, housingId: number) {
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

  if (error)
    throw new Error(`getStudentsHousedPerHousing Error: ${error.message}`);
  return data;
}

const getRoomDetails = async (housingId: number, roomId: number) => {
  const { data, error } = await supabase
    .from('room')
    .select(`
      room_id,
      room_type,
      maximum_occupants,

      student_accommodation_history (
        movein_date,
        moveout_date,

        student_academic (
          account_number,
          standing,
          status,
          degree_program
        )
      )
    `)
    .eq('housing_id', housingId)
    .eq('room_id', roomId)
    .eq('is_deleted', false)
    .single();

  if (error) throw error;


  return {
    room_id: data.room_id,
    room_type: data.room_type,
    
  };
};

// overdue or unpaid bills per student
const getOverallUnpaidFees = async (student_account_number: number) => {
  return await supabase
    .from('bill')
    .select(`
      *,
      student:student_account_number(
        user:account_number(first_name, last_name),
        student_accommodation_history (
          room:room_id (room_id, housing:housing_id (housing_name))
        )
      ),
      manager:manager_account_number(user:account_number (first_name, last_name))
    `)
    .eq('student_account_number', student_account_number)
    .in('status', ['Pending', 'Overdue'])
    .lt('due_date', TODAY)
    .eq('is_deleted', false);
};

// Get occupancy rate of 1 housing
// Returns a ratio = total current tenants / total maximum occupants
async function getOccupancyRate(housingId: number): Promise<number> {
	const { data, error } = await supabase
		.from("room")
		.select(`
      occupants_count,
      maximum_occupants,
      housing!inner(housing_id)
		`)
		.eq("housing.housing_id", housingId)
		.eq("housing.is_deleted", false);

	if (error) throw new Error(`getOccupancyRateOfHousing Error: ${error.message}`);
	if (!data || data.length === 0) return 0;

	const totalCurrent = data.reduce((sum, room) => sum + (room.occupants_count ?? 0), 0);
	const totalMaximum = data.reduce((sum, room) => sum + (room.maximum_occupants ?? 0), 0);

	if (totalMaximum == 0) return 0;

	return (totalCurrent / totalMaximum) * 100;
}

export const housingData = {
	create,
	findAll,
	findById,
	findWithRooms,
	update,
	deactivate,
	getStudentsHoused,
  getRoomDetails,
  getOverallUnpaidFees,
  getOccupancyRate
};
