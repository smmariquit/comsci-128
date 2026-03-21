export interface Room {
    room_id: number;
    occupancy_status: string;
    payment_status: string;
    room_type: 'Single' | 'Double' | 'Shared';
    maximum_occupants: number;
    housing_id: number;
    is_deleted: boolean;
} 

let mockRooms: Room[] = [
    {
        room_id: 101,
        occupancy_status: "Available",
        payment_status: "Pending",
        room_type: 'Double',
        maximum_occupants: 2,
        housing_id: 1,
        is_deleted: true
    }
];

export async function findRoomById(id: number): Promise<Room | null> {
    const room = mockRooms.find(r => r.room_id === id);
    return room || null;
}

export async function updateRoom(id: number, details: Partial<Room>): Promise<Room | null> {
    const roomIndex = mockRooms.findIndex(r => r.room_id === id);
    if (roomIndex === -1) return null;

    mockRooms[roomIndex] = {
        ...mockRooms[roomIndex],
        ...details
    };
    return mockRooms[roomIndex];
}