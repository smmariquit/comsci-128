import { supabase } from "@/lib/supabase";
import {
	Room,
	RoomInsert,
	RoomUpdate,
	RoomWithParentHousing,
} from "@/models/room";

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
async function findAllRoomDetailed () {
	const { data, error } = await supabase
		.from("room")
		.select(`
			*,
			housing:housing_id (housing_name),
			tenants:student_accommodation_history!room_id (
				student:student!account_number (
					user:user!account_number (
						first_name, last_name
					)
				)
			)
		`)
		.eq("is_deleted", false);
	
	if (error) throw new Error(error.message);

	return (data || []).map((room) => {
		let displayStatus = room.occupancy_status;
		// force tell it is occupied
		if (displayStatus?.toLowerCase().includes("occupied")) {
			displayStatus = "Occupied";
		} else if (!displayStatus || displayStatus?.toLowerCase().includes("empty")) {
			displayStatus = "Empty"
		}

		const validTypes = ["Single", "Double", "Shared", "Bedspace"];
		let displayType = validTypes.includes(room.room_type) ? room.room_type: "Bedspace";

		if (!validTypes.includes(displayType)) {
			displayType = "Shared";
		}

		return {
			room_id: room.room_id,
			room_code: String(room.room_id) || "N/A",
			housing_name: room.housing?.housing_name || "Unassigned",
			room_type: displayType,
			maximum_occupants: room.maximum_occupants || 0,
			current_occupants: room.tenants?.length || 0,
			occupancy_status: displayStatus,
			assigned_tenants: room.tenants?.map((t: any) => 
                `${t.student?.user?.first_name || ""} ${t.student?.user?.last_name || ""}`.trim()
            ).filter(Boolean) || [],
		}
	});
}

async function insertAccommodation(roomId: number, studentId: string) {
	const { data, error } = await supabase
		.from("student_accommodation_history")
		.insert({
			room_id: roomId,
			account_number: studentId,
			movein_date: new Date().toISOString().split('T')[0],
		})
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}

async function endAccommodation(roomId: number, studentId: string) {
	const { error } = await supabase
		.from("student_accommodation_history")
		.update({ moveout_date: new Date().toISOString().split('T')[0] })
		.eq("room_id", roomId)
		.eq("account_number", studentId)
		.is("moveout_date", null);
	
	if (error) throw new Error(error.message)
}

export const roomData = {
	create,
	findAll,
	findByHousingId,
	findByRoomId,
	update,
	deactivate,
	findAllRoomDetailed,
	insertAccommodation
};
