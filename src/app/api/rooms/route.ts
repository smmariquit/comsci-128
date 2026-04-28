import { type NextRequest, NextResponse } from "next/server";
import * as roomService from "@/app/lib/services/room-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body) {
      return NextResponse.json(
        { message: "Room data is required." },
        { status: 400 },
      );
    }

    const newRoom = await roomService.addRoom(body);
    if (!newRoom)
      return NextResponse.json(
        { message: "Failed to create room." },
        { status: 400 },
      );

    return NextResponse.json(newRoom, { status: 201 });
  } catch (error: any) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { message: "Failed to create room.", error: error.message },
      { status: 500 },
    );
  }
}

// fetch all rooms
export async function GET(_request: NextRequest) {
  try {
    /*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */

    // Check request/call user service
    const room = await roomService.getAllRooms();

    // Send Response
    if (!room) {
      // room not found
      return NextResponse.json({ message: "Room not found." }, { status: 404 });
    }

    // Room found
    return NextResponse.json(room, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching room", error);
    return NextResponse.json(
      { message: "Failed to fetch room.", error: error.message },
      { status: 500 },
    );
  }
}
