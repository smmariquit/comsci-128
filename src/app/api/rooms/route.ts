

import { NextRequest, NextResponse } from "next/server";
import { addRoom, getRoom } from "@/services/room-service";

export async function POST(request: NextRequest) {

  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    if (!body) {
      return NextResponse.json({ message: "Room data is required." }, { status: 400 })
    }

    const newRoom = await addRoom(body)
    if (!newRoom) return NextResponse.json({ message: "Failed to create room." }, { status: 400 })

    return NextResponse.json(newRoom, { status: 201 })

  } catch (error: any) {
    console.error("Error creating room:", error)
    return NextResponse.json(
      { message: "Failed to create room.", error: error.message },
      { status: 500 }
    )
  }
}

// fetch only one room details
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		/*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */
		const { id } = await params;

		// Check request/call user service
		const room = await getRoom(Number(id));

		// Send Response
		if (!room) {
			// room not found
			return NextResponse.json(
				{ message: "Room not found." },
				{ status: 404 },
			);
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

// fetch all rooms

