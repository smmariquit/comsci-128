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
			room!inner(*)
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
    .select(`
      *,
      room!inner(*)
    `)
    .eq("is_deleted", false);

  if (error) throw new Error(`findAllWithRooms Error: ${error.message}`);

  return data.map((h: any) => ({
    ...h,
    room: h.room?.filter((r: any) => !r.is_deleted) ?? [],
  }));
}

async function getHousingCardsData() {
  // fetch housing and associated rooms
  const { data: housings, error } = await supabase
    .from("housing")
    .select(`
            *,
            room!inner(*)
        `)
    .eq("is_deleted", false)
    .order("housing_name", { ascending: true });

  if (error) throw new Error(error.message);

  // map and calculate the exact props needed for the DormCard
  return housings.map((housing) => {
    const activeRooms = housing.room?.filter((r: any) => !r.is_deleted) || [];

    const totalRooms = activeRooms.length;
    const vacantRooms = activeRooms.filter(
      (r: any) => r.occupancy_status === "Empty",
    ).length;
    const occupiedRooms = totalRooms - vacantRooms;

    const occupancyRate =
      totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      housingId: housing.housing_id.toString(),
      name: housing.housing_name,
      address: housing.housing_address,
      totalRooms,
      occupiedRooms,
      vacantRooms,
      occupancyRate,
      minRent: housing.rent_price,
    };
  });
}

async function uploadHousingImage(
  housingId: number,
  file: File,
): Promise<Housing | null> {
  const fileExt = file.name.split(".").pop();
  const fileName = `housing-${housingId}-${Date.now()}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("dorm_images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError)
    throw new Error(`Storage Upload Error: ${uploadError.message}`);

  const { data: publicUrlData } = supabase.storage
    .from("dorm_images")
    .getPublicUrl(uploadData.path);

  const imageUrl = publicUrlData.publicUrl;

  return await update(housingId, {
    housing_image: imageUrl,
  } as Partial<HousingUpdate>);
}

const getRoomDetails = async (housingId: number, roomId: number) => {
  const { data, error } = await supabase
    .from("room")
    .select(`
      room_id,
      room_type,
      maximum_occupants,

      student_accommodation_history!inner(
        movein_date,
        moveout_date,

        student_academic!inner(
          account_number,
          standing,
          status,
          degree_program
        )
      )
    `)
    .eq("housing_id", housingId)
    .eq("room_id", roomId)
    .eq("is_deleted", false)
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
    .from("bill")
    .select(`
      *,
      manager!inner(
        user!inner(
          first_name,
          last_name,
          student!inner(
            *,
            student_accommodation_history!inner(
              room!inner(
                room_id,
                housing!inner(housing_name
              )
            )
          )
        )
      )
    `)
    .eq("student_account_number", student_account_number)
    .in("status", ["Pending", "Overdue"])
    .lt("due_date", TODAY)
    .eq("is_deleted", false);
};

async function countAllHousing(): Promise<number | null> {
  const { count, error } = await supabase
    .from("housing")
    .select("*", { count: "exact", head: true })
    .eq("is_deleted", false);

  if (error) throw new Error(error.message);

  return count;
}

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

  if (error)
    throw new Error(`getOccupancyRateOfHousing Error: ${error.message}`);
  if (!data || data.length === 0) return 0;

  const totalCurrent = data.reduce(
    (sum, room) => sum + (room.occupants_count ?? 0),
    0,
  );
  const totalMaximum = data.reduce(
    (sum, room) => sum + (room.maximum_occupants ?? 0),
    0,
  );

  if (totalMaximum === 0) return 0;

  return (totalCurrent / totalMaximum) * 100;
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

async function findAllByManager(managerAccountNumber: number) {
  const { data, error } = await supabase
    .from("housing")
    .select("*")
    .eq("is_deleted", false)
    .eq("landlord_account_number", managerAccountNumber);

  if (error) {
    console.error("Error fetching housing by manager: ", error);
    throw new Error("Failed to fetch housing");
  }

  return data;
}

async function findAllWithRoomsByManager(managerAccountNumber: number) {
  const { data, error } = await supabase
    .from("housing")
    .select("*, room(*)")
    .eq("is_deleted", false)
    .eq("landlord_account_number", managerAccountNumber);

  if (error) {
    console.error("Error fetching housing with rooms by manager: ", error);
    throw new Error("Failed to fetch housing with rooms");
  }

  return data;
}

export const housingData = {
  create,
  findAll,
  findById,
  findWithRooms,
  update,
  deactivate,
  getHousingCardsData,
  uploadHousingImage,
  countAllHousing,
  getRoomDetails,
  getOverallUnpaidFees,
  findAllWithRooms,
  getOccupancyRate,
  getStudentsHoused,
  findAllByManager,
  findAllWithRoomsByManager
};
