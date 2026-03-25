import { supabase } from "@/lib/supabase";
import { Room, RoomInsert } from "@/models/room";

export async function createRoom(data: RoomInsert): Promise<Room> {
	const { data: newRecord, error } = await supabase
		.from("room")
		.insert(data)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return newRecord;
}

export async function findRoomById(roomId: number): Promise<Room | null> {
	const { data, error } = await supabase
		.from("room")
		.select("*")
		.eq("room_id", roomId)
		.eq("is_deleted", false)
		.single();

	if (error) return null;
	return data;
}

export async function getRoomsByHousingId(housing_id: number) {
	const { data, error } = await supabase
		.from("room")
		.select("*, housing:housing_id(housing_name, housing_address)")
		.eq("housing_id", housing_id)
		.eq("is_deleted", false);

	if (error) throw error;
	return data;
}

export async function getAllRooms(): Promise<Room[]> {
	const { data, error } = await supabase
		.from("room")
		.select("*")
		.eq("is_deleted", false);

	if (error) throw error;
	return data;
}

export async function updateRoom(
	roomId: number,
	updatedFields: Partial<Room>,
): Promise<Room[]> {
	const { data, error } = await supabase
		.from("room")
		.update(updatedFields)
		.eq("room_id", roomId)
		.eq("is_deleted", false)
		.select();

	if (error) throw error;
	return data;
}

// Room Record Soft Delete
export async function deleteRoom(roomId: number): Promise<Room> {
	const { data, error } = await supabase
		.from("room")
		.update({ is_deleted: true })
		.eq("room_id", roomId)
		.select()
		.single();

	if (error) {
		console.error("Database Error (deleteRoom):", error.message);
		throw new Error(error.message);
	}

	return data;
}
