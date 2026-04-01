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
			tenants:student_accomodation (
				student:account_number (
					user:account_number (
						first_name, last_name
					)
				)
			)
		`)
		.eq("is_deleted", false);
	
	if (error) throw new Error(error.message);

	return (data || []).map((room) => ({
		room_id: room.room_id,
		room_code: room.room_code,
		housing_name: room.housing?.housing_name || "Unassigned",
		room_type: room.room_type,
		maximum_occupants: room.maximum_occupants,
		current_occupants: room.tenants?.length || 0,
		occupancy_status: room.occupancy_status,
		assigned_tenants: room.tenants?.map((t: any) => 
			`${t.student?.user?.first_name} ${t.student?.user?.last_name}`
		) || [],
	}));
}

export const roomData = {
	create,
	findAll,
	findByHousingId,
	findByRoomId,
	update,
	deactivate,
	findAllRoomDetailed
};
