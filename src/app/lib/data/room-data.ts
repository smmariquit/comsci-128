import { supabase } from "@/lib/supabase";
import type {
  Room,
  RoomInsert,
  RoomUpdate,
  RoomWithParentHousing,
} from "@/models/room";
import { OccupancyStatus, RoomRow } from "@/components/admin/rooms/roomtable";

async function create(data: RoomInsert): Promise<Room | null> {
  const { data: newRecord, error } = await supabase
    .from("room")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return newRecord;
}

async function findByRoomId(roomId: number): Promise<Room | null> {
  const { data, error } = await supabase
    .from("room")
    .select("*")
    .eq("room_id", roomId)
    .eq("is_deleted", false)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return data;
}

async function findByHousingId(
  housing_id: number,
): Promise<RoomWithParentHousing> {
  const { data, error } = await supabase
    .from("room")
    .select(
      `*,
            housing:housing_id(
            housing_name, housing_address
            )`,
    )
    .eq("housing_id", housing_id)
    .eq("is_deleted", false)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function findAll(): Promise<Room[] | []> {
  const { data, error } = await supabase
    .from("room")
    .select("*")
    .eq("is_deleted", false);

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function update(
  roomId: number,
  updatedFields: Partial<RoomUpdate>,
): Promise<Room | null> {
  const { data, error } = await supabase
    .from("room")
    .update(updatedFields)
    .eq("room_id", roomId)
    .eq("is_deleted", false)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return data;
}

// Room Record Soft Delete
async function deactivate(roomId: number): Promise<Room | null> {
  const { data, error } = await supabase
    .from("room")
    .update({ is_deleted: true })
    .eq("room_id", roomId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data;
}

// Find Room for Housing Admin View
async function findAllRoomDetailed (managedHousingIds: number[] = []): Promise<RoomRow[]> {
	if (managedHousingIds.length === 0) {
		return [];
	}
	
	let query = supabase
		.from("room")
		.select(`
			*,
			housing:housing_id (housing_name),
			tenants:student_accommodation_history!room_id (
				account_number,
				movein_date,
				moveout_date,
				student:student!account_number (
					user:user!account_number (
						first_name, last_name
					)
				)
			)
		`)
		.eq("is_deleted", false);
	
	if (managedHousingIds && managedHousingIds.length > 0) {
		query = query.in("housing_id", managedHousingIds);
	}

	const { data, error } = await query
	if (error) throw new Error(error.message);

	return (data || []).map((room) => {
		const today = new Date().toISOString().split('T')[0];
		const activeTenants = (room.tenants || []).filter((t: any) => t.moveout_date >= today);

		const occupantCount = activeTenants.length;
		const max = room.maximum_occupants;

		let derivedStatus: OccupancyStatus = "Empty";
		if (occupantCount >= max) {
            derivedStatus = "Fully Occupied";
        } else if (occupantCount > 0) {
            derivedStatus = "Partially Occupied";
        }

		return {
			room_id: room.room_id,
			room_code: room.room_code,
			housing_name: room.housing?.housing_name || "Unassigned",
			housing_id: room.housing_id,
			room_type: room.room_type,
			maximum_occupants: room.maximum_occupants,
			current_occupants: occupantCount,
			occupancy_status: derivedStatus,
			assigned_tenants: activeTenants.map((t: any) => {
				const s = t.student;
				const firstName = s?.user?.first_name || "Unknown";
				const lastName = s?.user?.last_name || `(ID: ${t.account_number})`;
				
				return {
					id: String(t.account_number),
					name: `${firstName} ${lastName}`.trim()
				};
			}).filter((t: any) => t.id)
		}
	});
}

async function insertAccommodation(roomId: number, studentId: number) {
	const { data: appData } = await supabase
		.from("application")
		.select("expected_moveout_date")
		.eq("student_account_number", studentId)
		.eq("application_status", "Approved")
		.limit(1)
		.maybeSingle();

	const moveoutDate = appData?.expected_moveout_date ?? "9999-12-31";

	const { data, error } = await supabase
		.from("student_accommodation_history")
		.insert({
			room_id: roomId,
			account_number: studentId,
			movein_date: new Date().toISOString().split('T')[0],
			moveout_date: moveoutDate,
		})
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}

async function endAccommodation(roomId: number, studentId: number) {
	const { error } = await supabase
		.from("student_accommodation_history")
		.update({ moveout_date: new Date().toISOString().split('T')[0]})
		.eq("room_id", roomId)
		.eq("account_number", studentId)
		.gte("moveout_date", new Date().toISOString().split('T')[0])
	
	if (error) throw new Error(error.message);
}

async function findUnassignedStudents(roomType: string, adminId: number) {
	let targetSex: string | null = null;

	if (roomType === "Men Only") targetSex = "Male";
	if (roomType === "Women Only") targetSex = "Female";

	const { data, error } = await supabase
		.from("student")
		.select(`
            account_number,
            user:user!account_number (first_name, last_name, sex), 
            history:student_accommodation_history!account_number (moveout_date), 
            applications:application!account_number (application_status, landlord_account_number)
        `);

	if (error) throw new Error(error.message);

	return (data || []).filter(item => {
            const userObj = Array.isArray(item.user) ? item.user[0] : item.user;

            const isApproved = item.applications?.some(
				(app: any) => app.application_status === "Approved" && app.landlord_account_number == adminId
			);

			const today = new Date().toISOString().split('T')[0];
            const isCurrentlyUnassigned = !item.history?.some(h => h.moveout_date >= today);

            const matchesSex = !targetSex || userObj?.sex === targetSex;

            return isApproved && isCurrentlyUnassigned && matchesSex;
        }).map(item => {
            const u = Array.isArray(item.user) ? item.user[0] : item.user;
            return {
                id: item.account_number,
                name: u ? `${u.first_name} ${u.last_name} (${u.sex})` : `ID: ${item.account_number}`
            };
        });
}

async function getOccupantCount(roomId: number, increment: number) {
	const { data, error: fetchError } = await supabase
		.from("room")
		.select('occupants_count, maximum_occupants')
		.eq('room_id', roomId)
		.single();
	
	if (fetchError) throw new Error(fetchError.message);

	const newCount = Math.max(0, (data.occupants_count || 0) + increment)

	const { error: updateError } = await supabase
	.from("room")
	.update({
		occupants_count: newCount,
	})
	.eq('room_id', roomId);

	if (updateError) throw new Error(updateError.message);
	
	return newCount;
}

async function getAccountbyStudentNumber(studentNumber: string) {
	const { data, error } = await supabase
		.from("student")
		.select('account_number')
		.eq('student_number', studentNumber)

	if (error || !data) {
		throw new Error(error.message);
	}

	if(!data || data.length === 0) {
		throw new Error(`No student found: ${studentNumber}`);
	}

	return data[0].account_number;
}

async function updateStudentHousingStatus(accountNumber: number, status: string) {
	const { error } = await supabase
		.from("student")
		.update({
			housing_status: status
		})
		.eq('account_number', accountNumber)

		if (error) throw new Error(error.message);
}



async function getRoomStats() {
  const { data, error } = await supabase
    .from("room")
    .select("maximum_occupants, occupancy_status")
    .eq("is_deleted", false)

  if (error) {
    throw new Error(error.message);
  }

  const totalRooms = data?.length ?? 0
  const totalOccupants = data?.reduce((sum, r) => sum + (r.maximum_occupants ?? 0), 0) ?? 0
  const totalFreeRooms = data?.filter(r => r.occupancy_status === "Empty").length ?? 0

  return { totalRooms, totalOccupants, totalFreeRooms }
}

export const roomData = {
	create,
	findAll,
	findByHousingId,
	findByRoomId,
	update,
	deactivate,
	findAllRoomDetailed,
	insertAccommodation,
	endAccommodation,
	findUnassignedStudents,
	getOccupantCount,
	getAccountbyStudentNumber,
	updateStudentHousingStatus,
	getRoomStats
};
