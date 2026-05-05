import { type NextRequest, NextResponse } from "next/server";
import * as roomService from "@/app/lib/services/room-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    /*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */
    const { roomId } = await params;

    // Check request/call user service
    const room = await roomService.getRoom(Number(roomId));

    // Send Response
    if (!room) {
      // room not found
      return NextResponse.json({ message: "Room not found." }, { status: 404 });
    }

    // User found
    return NextResponse.json(room, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching room", error);
    return NextResponse.json(
      { message: "Failed to fetch room.", error: error.message },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ roomId: string }> },
) {
  try {
    const { roomId } = await params;
    const parsedId = Number(roomId);

    if (Number.isNaN(parsedId)) {
      return NextResponse.json(
        { message: "Invalid room ID." },
        { status: 400 },
      );
    }

    let updates: unknown;
    try {
      updates = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Malformed JSON body." },
        { status: 400 },
      );
    }

    if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
      return NextResponse.json(
        { message: "Room update data is required." },
        { status: 400 },
      );
    }

    const result = await roomService.updateRoom(
      parsedId,
      updates as Parameters<typeof roomService.updateRoom>[1],
    );

    if (result.error) {
      const status = result.error.includes("Not Found") ? 404 : 400;
      return NextResponse.json({ message: result.error }, { status });
    }

    return NextResponse.json(result.data, { status: 200 });
  } catch (error: any) {
    console.error("Error updating room", error);
    return NextResponse.json(
      { message: "Failed to update room.", error: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
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
    const deletedRoom = await roomService.deactivateRoom(Number(roomId));

    if (!deletedRoom) {
      return NextResponse.json(
        { error: "Room record not found or already deleted" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Room deleted successfully",
        data: deletedRoom,
      },
      { status: 200 },
    );
  } catch (error: any) {
    // Capture business logic error (e.g., "Room not empty")
    const errorMessage = error.message || "Internal Server Error";
    const status = errorMessage.includes("empty") ? 400 : 500;

    return NextResponse.json({ error: errorMessage }, { status: status });
  }
}
