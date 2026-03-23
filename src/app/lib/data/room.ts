import { supabase} from "../supabase";

export type OccupancyStatus = 'Empty' | 'Fully Occupied' | 'Partially Occupied' 

export type PaymentStatus = 'Paid' | 'Pending' | 'Overdue'

export type RoomType = 'Single' | 'Double' | 'Shared'

export interface Room {
    room_id?: number
    occupancy_status: OccupancyStatus
    payment_status: PaymentStatus
    room_type: RoomType
    maximum_occupants: number
    housing_id: number
    is_deleted?: boolean
  }

export async function createRoom(room:Room) {

    const { data, error} = await supabase
    .from('room')
    .insert([room])
    .select()

    if (error) throw error
    return data
    
}

//Read only shows non-deleted rooms flagged by is_deleted=false
export async function getRoomById(room_id: number) {
    const { data, error } = await supabase
      .from('room')
      .select('*')
      .eq('room_id', room_id)
      .eq('is_deleted', false)
      .single();
  
    if (error) throw error;
    return data;
  }

export async function getRoomsByHousingId(housing_id: number) {
    const { data, error } = await supabase
      .from('room')
      .select('*, housing:housing_id(housing_name, housing_address)')
      .eq('housing_id', housing_id) 
      .eq('is_deleted', false)
  
    if (error) throw error;
    return data;
  
}

export async function getAllRooms(){
    const { data, error } = await supabase
      .from('room')
      .select('*')
      .eq('is_deleted', false)
  
    if (error) throw error;
    return data;
}

export async function updateRoom(roomId: number, updatedFields: Partial<Room>) {
    const { data, error } = await supabase
      .from('room')
      .update(updatedFields)
      .eq('room_id', roomId)
      .eq('is_deleted', false)
      .select();
  
    if (error) throw error;
    return data;
  }

  
export async function deleteRoom(roomId: number) {
    const { data, error } = await supabase
      .from('room')
      .update({ is_deleted: true })
      .eq('room_id', roomId)
      .select();
  
    if (error) throw error;
    return data;
  }
