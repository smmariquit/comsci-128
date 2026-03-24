import { NextRequest, NextResponse } from "next/server";
import { removeRoom } from "@/app/lib/services/room-service";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ roomId: string }> },
) {
    try {
        /*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */
        const { roomId } = await params;
        
        // Convert string param to number to match the DB bigint
        const deletedRoom = await removeRoom(Number(roomId));

        if (!deletedRoom) {
            return NextResponse.json(
                { error: "Room record not found or already deleted" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { 
                message: "Room deleted successfully", 
                data: deletedRoom 
            }, 
            { status: 200 },
        );
    } catch (error: any) {
        // Capture business logic error (e.g., "Room not empty")
        const errorMessage = error.message || "Internal Server Error";
        const status = errorMessage.includes("empty") ? 400 : 500;

        return NextResponse.json(
            { error: errorMessage },
            { status: status },
        );
    }
}