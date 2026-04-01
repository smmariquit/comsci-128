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
		await roomData.update(roomId, {occupancy_status: "Partially Occupied" as any});

		return { success: true };
	} catch (error: any) {
		console.error("Service Error (assignStudent): ", error.message);
		throw new Error(error.message || "Failed to assign student.");
	}
};

const unassignRoom = async (roomId: number, studentId: string) => {
	try {
		await roomData.endAccommodation(roomId, studentId);

		const room = await roomData.findAllRoomDetailed();
		const currentRoom = room.find(r => r.room_id === roomId);

		if (currentRoom?.current_occupants === 0) {
			await roomData.update(roomId, { occupancy_status: "Empty" as any});
		}

		return { success: true }
	} catch (error: any) {
		console.error("Service Error (unassignStudent): ", error.message);
		throw new Error(error.message || "Failed to unassign student.");
	}
};

export const roomService = {
	addRoom,
	getRoom,
	getAllRooms,
	updateRoom,
	deactivateRoom,
	assignRoom,
	unassignRoom
};
