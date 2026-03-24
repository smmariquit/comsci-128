import { findRoomById, updateRoom, Room, RoomType, OccupancyStatus, PaymentStatus, createRoom, deleteRoom, getAllRooms } from "@/data/room";
import { RoomInsert, Room } from "@/models/room";

export const addRoom = async (data: RoomInsert): Promise<Room | null> => {
  
try {
    
    const newRoom = await createRoom(data)
    if (!newRoom) return null
    return newRoom
    
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Error")
  }
}

export const getRoom = async (roomId: number): Promise<Room | null> => {

    try {
		const room = await findRoomById(roomId);

		return room ?? null;

	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}

}

export const featchAllRooms = async (): Promise<Room[]> => {
	try {
		const rooms = await getAllRooms();
		return rooms ?? [];
	} catch (error) {
		console.error("Error:", error);
		throw new Error("Error");
	}
};



export const updateRoomDetails = async (roomId: number, updates: Partial<Room>) => {
    try {
        let existingRoom
        try {
            existingRoom = await findRoomById(roomId);
        } catch (error) {
            return { error: "Room Not Found." };
        }

        const validRoomTypes: RoomType[] = ['Single', 'Double', 'Shared'];
        if (updates.room_type && !validRoomTypes.includes(updates.room_type)) {
            return { error: "Invalid Room "};
        }

        if ((updates.maximum_occupants ?? existingRoom.maximum_occupants) < 1) {
            return { error: "Maximum occupants must be atleast 1."};
        }

        const dataArray = await updateRoom(roomId, updates);
        const data = dataArray && dataArray.length > 0 ? dataArray[0] : null;

        if (!data) {
            return { error: "Update failed."};
        }

        // to improve: audit trail
        console.log(`Log: Room ${roomId} details updated.`)

        return { data };

    } catch (error) {
        console.error("Error: ", error);
        throw new Error("Error");
    }
}

// tester
export const testRoomUpdate = async () => {
    console.log("-test-");

    const passTest = await updateRoomDetails(101, 
        { room_type: 'Shared', maximum_occupants: 4}
    )
    console.log("First Test: ", passTest.data ? "Pass" : "Fail");

    const failInvalidType = await updateRoomDetails(101, {
        room_type: 'Suite' as any}
    )
    console.log("Second Test: ", failInvalidType.error ? "Pass" : "Fail");

    const failMissingRoom = await updateRoomDetails(999, {
        maximum_occupants: 2}
    )
    console.log("Third Test: ", failMissingRoom.error === "Room Not Found." ? "Pass" : "Fail");
}

testRoomUpdate();

// Service logic for removing a room.
// Ensures the room exists and is empty before performing a soft delete.
export const removeRoom = async (roomId: number): Promise<Room | null> => {
    console.log("Service received roomId:", roomId, "Type:", typeof roomId);
    try {
        const room = await findRoomById(roomId);
        console.log("Room found in DB:", room); // This will show you if it's null or already deleted

        if (!room) {
            return null;
        }

        // Prevent deletion if the room is not empty
        if (room.occupancy_status !== "Empty") {
            throw new Error("Cannot delete room: Room status must be 'Empty' to deactivate.");
        }

        const deletedRoom = await deleteRoom(roomId);

        return deletedRoom ?? null;
    } catch (error: any) {
        console.error("Service Error (removeRoom): ", error.message);
        throw new Error(error.message || "Failed to remove room");
    }
};
