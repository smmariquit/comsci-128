
import { supabase } from "@/lib/supabase";
import {Room, RoomInsert} from "@/models/room";

export type NewRoom = Omit<Room, "room_id" | "is_deleted">

export async function createRoom(data: RoomInsert): Promise<Room> {
  const { data: newRecord, error } = await supabase
    .from("room")
    .insert(data)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return newRecord
}