import { supabase } from "@/lib/supabase";
import type {
  Housing,
  HousingInsert,
  HousingUpdate,
  HousingWithRooms,
} from "@/models/housing";

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

  if (error)
    throw new Error(`getHousingDetailsofStudent Error: ${error.message}`);

  return studentHousingDetails;
}

async function getStudentsHousedPerHousing(
  managerId: number,
  housingId: number,
) {
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

async function getHousingCardsData() {
    // fetch housing and associated rooms
    const { data: housings, error } = await supabase
        .from("housing")
        .select(`
            *,
            room (*)
        `)
        .eq("is_deleted", false)
        .order("housing_name", { ascending: true });

    if (error) throw new Error(error.message);

    // map and calculate the exact props needed for the DormCard
    return housings.map((housing) => {
        const activeRooms = housing.room?.filter((r: any) => !r.is_deleted) || [];
        
        const totalRooms = activeRooms.length;
        const vacantRooms = activeRooms.filter((r: any) => r.occupancy_status === "Empty").length;
        const occupiedRooms = totalRooms - vacantRooms;
        
        const occupancyRate = totalRooms > 0 
            ? Math.round((occupiedRooms / totalRooms) * 100) 
            : 0;

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

async function uploadHousingImage(housingId: number, file: File): Promise<Housing | null> {
    const fileExt = file.name.split('.').pop();
    const fileName = `housing-${housingId}-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("dorm_images")
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false 
        });

    if (uploadError) throw new Error("Storage Upload Error: " + uploadError.message);

    const { data: publicUrlData } = supabase.storage
        .from("dorm_images")
        .getPublicUrl(uploadData.path);

    const imageUrl = publicUrlData.publicUrl;

    return await update(housingId, { housing_image: imageUrl } as Partial<HousingUpdate>);
}

export const housingData = {
	create,
	findAll,
	findById,
	findWithRooms,
	update,
	deactivate,
	getHousingCardsData,
  getHousingDetailsOfStudent,
  getStudentsHousedPerHousing,
  uploadHousingImage
};
