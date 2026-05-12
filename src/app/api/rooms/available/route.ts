import { NextRequest, NextResponse } from "next/server";
import { getAvailableRoomsForAssignment } from "@/lib/services/room-service"; 

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const housingId = Number(searchParams.get("housingId"));
        const roomType = searchParams.get("roomType");

        // Validate incoming request
        if (!housingId || isNaN(housingId) || !roomType) {
            return NextResponse.json(
                { message: "Missing or invalid housingId or roomType parameters." }, 
                { status: 400 }
            );
        }
        
        const availableRooms = await getAvailableRoomsForAssignment(housingId, roomType);

        return NextResponse.json({ availableRooms }, { status: 200 });

    } catch (error: any) {
        console.error("Error in GET /api/rooms/available:", error);
        return NextResponse.json(
            { message: "Failed to fetch available rooms", error: error.message }, 
            { status: 500 }
        );
    }
}