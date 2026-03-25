import {
	createRoom,
	deleteRoom,
	findRoomById,
	getAllRooms,
	updateRoom,
} from "@/app/lib/data/room-data";
import { Room, RoomInsert, RoomType, RoomUpdate } from "@/models/room";

export const addRoom = async (data: RoomInsert): Promise<Room | null> => {
	try {
		const newRoom = await createRoom(data);
		if (!newRoom) return null;
		return newRoom;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Failed to add room.");
	}
};

export const getRoom = async (roomId: number): Promise<Room | null> => {
	try {
		const room = await findRoomById(roomId);
		return room ?? null;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Failed to get room.");
	}
};

export const fetchAllRooms = async (): Promise<Room[]> => {
	try {
		const rooms = await getAllRooms();
		return rooms ?? [];
	} catch (error) {
		console.error("Error:", error);
		throw new Error("Failed to fetch rooms.");
	}
};

export const updateRoomDetails = async (
	roomId: number,
	updates: Partial<Room>,
): Promise<{ data?: Room; error?: string }> => {
	try {
		const existingRoom = await findRoomById(roomId);
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

		const dataArray = await updateRoom(roomId, updates);
		const data = dataArray && dataArray.length > 0 ? dataArray[0] : null;
		if (!data) {
			return { error: "Update failed." };
		}

		console.log(`Log: Room ${roomId} details updated.`);
		return { data };
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Failed to update room details.");
	}
};

export const removeRoom = async (roomId: number): Promise<Room | null> => {
	try {
		const room = await findRoomById(roomId);
		if (!room) {
			return null;
		}

		if (room.occupancy_status !== "Empty") {
			throw new Error(
				"Cannot delete room: Room status must be 'Empty' to deactivate.",
			);
		}

		const deletedRoom = await deleteRoom(roomId);
		return deletedRoom ?? null;
	} catch (error: any) {
		console.error("Service Error (removeRoom): ", error.message);
		throw new Error(error.message || "Failed to remove room.");
	}
};
