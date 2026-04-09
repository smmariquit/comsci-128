import { roomData } from "@/app/lib/data/room-data";
import { Room, RoomInsert, RoomType, RoomUpdate } from "@/models/room";

const addRoom = async (data: RoomInsert): Promise<Room | null> => {
	try {
		const newRoom = await roomData.create(data);
		if (!newRoom) return null;
		return newRoom;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Failed to add room.");
	}
};

const getRoom = async (roomId: number): Promise<Room | null> => {
	try {
		const room = await roomData.findByRoomId(roomId);
		return room ?? null;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Failed to get room.");
	}
};

const getAllRooms = async (): Promise<Room[]> => {
	try {
		const rooms = await roomData.findAll();
		return rooms ?? [];
	} catch (error) {
		console.error("Error:", error);
		throw new Error("Failed to fetch rooms.");
	}
};

const updateRoom = async (
	roomId: number,
	updates: RoomUpdate,
): Promise<{ data?: Room; error?: string }> => {
	try {
		const existingRoom = await roomData.findByRoomId(roomId);
		if (!existingRoom) {
			return { error: "Room Not Found." };
		}

		const validRoomTypes: RoomType[] = ["Single", "Double", "Shared"];
		if (
			updates.room_type &&
			!validRoomTypes.includes(updates.room_type as RoomType)
		) {
			return { error: "Invalid Room Type." };
		}

		const incomingMax =
			updates.maximum_occupants ?? existingRoom.maximum_occupants;
		if (typeof incomingMax === "number" && incomingMax < 1) {
			return { error: "Maximum occupants must be at least 1." };
		}

		const updatedRoom = await roomData.update(roomId, updates);
		if (!updatedRoom) {
			return { error: "Update failed." };
		}

		console.log(`Log: Room ${roomId} details updated.`);
		return { data: updatedRoom };
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Failed to update room details.");
	}
};

const deactivateRoom = async (roomId: number): Promise<Room | null> => {
	try {
		const room = await roomData.findByRoomId(roomId);
		if (!room) {
			return null;
		}

		if (room.occupancy_status !== "Empty") {
			throw new Error(
				"Cannot delete room: Room status must be 'Empty' to deactivate.",
			);
		}

		const deletedRoom = await roomData.deactivate(roomId);
		return deletedRoom ?? null;
	} catch (error: any) {
		console.error("Service Error (removeRoom): ", error.message);
		throw new Error(error.message || "Failed to remove room.");
	}
};

const assignRoom = async (roomId: number, studentId: string) => {
	try {
		await roomData.insertAccommodation(roomId, studentId);

		await roomData.getOccupantCount(roomId, 1);

		return { success: true };
	} catch (error: any) {
		console.error("Service Error (assignStudent): ", error.message);
		throw new Error(error.message || "Failed to assign student.");
	}
};

const unassignRoom = async (roomId: number, studentId: string) => {
	try {
		await roomData.endAccommodation(roomId, studentId);

		await roomData.getOccupantCount(roomId, -1)

		return { success: true }
	} catch (error: any) {
		console.error("Service Error (unassignStudent): ", error.message);
		throw new Error(error.message || "Failed to unassign student.");
	}
};

const getEligibleStudents = async () => {
	try {
		const allStudents = await roomData.findUnassignedStudents();

		const rooms = await roomData.findAllRoomDetailed();
		const assignedIds = new Set(
			rooms.flatMap(r => r.assigned_tenants?.map((t: any) => t.id))	
		);

		return allStudents.filter(s => !assignedIds.has(s.id));
	} catch (error: any) {
		console.error("Service Error (getElligibleStudents): ", error.message);
		//throw new Error(error.message || "Failed to fetch unassigned students.");
		return [];
	}
}

export const roomService = {
	addRoom,
	getRoom,
	getAllRooms,
	updateRoom,
	deactivateRoom,
	assignRoom,
	unassignRoom,
	getEligibleStudents,
};
