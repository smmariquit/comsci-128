import { supabase } from "@/lib/supabase";
import {
	Room,
	RoomInsert,
	RoomUpdate,
	RoomWithParentHousing,
} from "@/models/room";
import { RoomRow } from "@/components/admin/rooms/roomtable";

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
async function findAllRoomDetailed (): Promise<RoomRow[]>{
	const { data, error } = await supabase
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
	
	if (error) throw new Error(error.message);

	return (data || []).map((room) => {
		let displayStatus = room.occupancy_status;
		const normalizedStatus = displayStatus?.toLowerCase() || "";

		// force tell it is occupied
		if (normalizedStatus.includes("occupied") || normalizedStatus.includes("partially occupied")) {
			displayStatus = "Occupied";
		} else {
			displayStatus = "Empty"
		}

		let displayType: RoomRow['room_type'] = "Shared" //default (for <= 3)

		if (room.maximum_occupants === 1) {
			displayType = "Single";
		} else if (room.maximum_occupants === 2) {
			displayType = "Double";
		}

		return {
			room_id: room.room_id,
			room_code: room.room_code,
			housing_name: room.housing?.housing_name || "Unassigned",
			room_type: displayType,
			maximum_occupants: room.maximum_occupants || 0,
			current_occupants: room.tenants?.length || 0,
			occupancy_status: displayStatus,
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

async function endAccommodation(roomId: number, studentId: string) {
	const { error } = await supabase
		.from("student_accommodation_history")
		.update({ moveout_date: new Date().toISOString().split('T')[0] })
		.eq("room_id", roomId)
		.eq("account_number", studentId)
		.is("moveout_date", null);
	
	if (error) throw new Error(error.message)
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

	if (error) throw new Error(error.message)

	return (data || []).map(item => {
		const u = Array.isArray(item.user) ? item.user[0] : item.user;

		return {
			id: item.account_number,
			name: u ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : ""
		};
	});
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
};
