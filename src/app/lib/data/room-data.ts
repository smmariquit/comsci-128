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
		const occupantCount = room.tenants?.length || 0;
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
			assigned_tenants: (room.tenants || []).map((t: any) => {
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

async function insertAccommodation(roomId: number, studentId: string) {
	const { data, error } = await supabase
		.from("student_accommodation_history")
		.insert({
			room_id: roomId,
			account_number: parseInt(studentId),
			movein_date: new Date().toISOString().split('T')[0],
			moveout_date: new Date().toISOString().split('T')[0],
		})
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}

async function endAccommodation(roomId: number, studentId: number) {
	const { error } = await supabase
		.from("student_accommodation_history")
		.delete()
		.eq("room_id", roomId)
		.eq("account_number", studentId)
	
	if (error) throw new Error(error.message);
}

async function findUnassignedStudents() {
	const { data, error } = await supabase
		.from("student")
		.select(`
			account_number,
			user:account_number (
				first_name,
				last_name
			)	
		`);

	if (error) throw new Error(error.message);

	return (data || []).map(item => {
		const u = Array.isArray(item.user) ? item.user[0] : item.user;

		return {
			id: item.account_number,
			name: u ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : ""
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
