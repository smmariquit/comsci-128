

import { createRoom } from "@/data/room";
import { RoomInsert, Room } from "@/models/room";

export const addRoom = async (data: RoomInsert): Promise<Room | null> => {
  
try {
    
    const newRoom = await createRoom(data)
    if (!newRoom) return null
    return newRoom
    
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Error")
  }
}