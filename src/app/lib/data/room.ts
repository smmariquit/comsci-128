import { Room } from "@/models/room";
import { supabase } from "@/lib/supabase";

// Room Record Soft Delete
export async function deleteRoom(roomId: number): Promise<Room> {
    const { data, error } = await supabase
        .from("room")
        .update({ is_deleted: true }) 
        .eq("room_id", roomId)
        .select()
        .single();

    if (error) {
        console.error("Database Error (deleteRoom):", error.message);
        throw new Error(error.message);
    }

    return data;
}