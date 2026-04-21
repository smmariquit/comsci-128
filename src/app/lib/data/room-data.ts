import { supabase } from "@/lib/supabase";
import type {
  Room,
  RoomInsert,
  RoomUpdate,
  RoomWithParentHousing,
} from "@/models/room";

async function create(data: RoomInsert): Promise<Room | null> {
  const { data: newRecord, error } = await supabase
    .from("room")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return newRecord;
}

async function findByRoomId(roomId: number): Promise<Room | null> {
  const { data, error } = await supabase
    .from("room")
    .select("*")
    .eq("room_id", roomId)
    .eq("is_deleted", false)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return data;
}

async function findByHousingId(
  housing_id: number,
): Promise<RoomWithParentHousing> {
  const { data, error } = await supabase
    .from("room")
    .select(
      `*,
            housing:housing_id(
            housing_name, housing_address
            )`,
    )
    .eq("housing_id", housing_id)
    .eq("is_deleted", false)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function findAll(): Promise<Room[] | []> {
  const { data, error } = await supabase
    .from("room")
    .select("*")
    .eq("is_deleted", false);

  if (error) throw new Error(error.message);
  return data ?? [];
}

async function update(
  roomId: number,
  updatedFields: Partial<RoomUpdate>,
): Promise<Room | null> {
  const { data, error } = await supabase
    .from("room")
    .update(updatedFields)
    .eq("room_id", roomId)
    .eq("is_deleted", false)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }
  return data;
}

// Room Record Soft Delete
async function deactivate(roomId: number): Promise<Room | null> {
  const { data, error } = await supabase
    .from("room")
    .update({ is_deleted: true })
    .eq("room_id", roomId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(error.message);
  }

  return data;
}

// Room stats for total occupants, free rooms

async function getRoomStats() {
  const { data, error } = await supabase
    .from("room")
    .select("maximum_occupants, occupancy_status")
    .eq("is_deleted", false)

  if (error) {
    throw new Error(error.message);
  }

  const totalRooms = data?.length ?? 0
  const totalOccupants = data?.reduce((sum, r) => sum + (r.maximum_occupants ?? 0), 0) ?? 0
  const totalFreeRooms = data?.filter(r => r.occupancy_status === "Empty").length ?? 0

  return { totalRooms, totalOccupants, totalFreeRooms }
}

export const roomData = {
	create,
	findAll,
	findByHousingId,
	findByRoomId,
	update,
	deactivate,
	getRoomStats
};
