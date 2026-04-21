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

const getTenants = async (managerAccountNumber: number) => {
    const { data: manager, error: managerError } = await supabase
      .from('manager')
      .select('account_number, manager_type')
      .eq('account_number', managerAccountNumber)

  if (managerError || !manager) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('room')
    .select(`
      room_id,
      room_type,

      housing (
        housing_name
      ),

      student_accommodation_history (
        move_in_date,
        expected_move_out_date,

        student_academic (
          account_number,
          degree_program,
          standing,
          status
        )
      )
    `);

  if (error) throw error;

  return data;
};

export const roomData = {
  create,
  findAll,
  findByHousingId,
  findByRoomId,
  update,
  deactivate,
  getTenants
};
