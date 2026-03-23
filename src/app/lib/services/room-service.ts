import { getRoomById, updateRoom, Room, RoomType, OccupancyStatus, PaymentStatus } from "@/data/room";

export const updateRoomDetails = async (roomId: number, updates: Partial<Room>) => {
    try {
        let existingRoom
        try {
            existingRoom = await getRoomById(roomId);
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