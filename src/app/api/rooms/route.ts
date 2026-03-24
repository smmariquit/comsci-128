

import { NextRequest, NextResponse } from "next/server";
import { addRoom } from "@/services/room-service";

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