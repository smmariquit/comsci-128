import { findRoomById, updateRoom, Room } from "../data/room";

export const updateRoomDetails = async (roomId: number, updates: Partial<Room>) => {
    try {
        const existingRoom = await findRoomById(roomId);
        if (!existingRoom) return { error: "Room Not Found."};

        const validRoomTypes = ['Single', 'Double', 'Shared'];
        if (updates.room_type && !validRoomTypes.includes(updates.room_type)) {
            return { error: "Invalid Room "}
        }

        if (updates.maximum_occupants && updates.maximum_occupants < 1) {
            return { error: "Maximum occupants must be atleast 1."};
        }

        const data = await updateRoom(roomId, updates);

        console.log(`Log: Room ${roomId} details updated.`)

        return data;

    } catch (error) {
        console.error("Error: ", error);
        throw new Error("Error");
    }
}