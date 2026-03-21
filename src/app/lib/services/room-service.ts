import { deleteRoom, findRoomById } from "@/app/lib/data/room";
import { Room } from "@/app/lib/models/room";

// Service logic for removing a room.
// Ensures the room exists and is empty before performing a soft delete.
export const removeRoom = async (roomId: number): Promise<Room | null> => {
    try {
        const room = await findRoomById(roomId);

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