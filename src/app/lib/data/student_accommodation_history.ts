import { supabase } from "../supabase";

export type HousingStatus = 'Assigned' | 'Not Assigned';

export interface AccommodationHistory {
  history_id?: number;
  account_number: number;
  room_id: number;
  move_in_date: string;
  expected_move_out_date: string;
  actual_move_out_date?: string | null;
  status: HousingStatus;
}

// CREATE a stay record (Check-in)
export async function createAccommodationHistory(history: AccommodationHistory) {
  const { data, error } = await supabase
    .from('student_accommodation_history')
    .insert([history])
    .select()
    .single();

  if (error) throw new Error(`History Record Creation Error: ${error.message}`);
  return data;
}

// UPDATE a stay record (Check-out)
export async function recordMoveOut(accountNumber: number, actualDate: string) {
  const { data, error } = await supabase
    .from('student_accommodation_history')
    .update({ 
      actual_move_out_date: actualDate,
      status: 'Not Assigned'
    })
    .eq('account_number', accountNumber)
    .is('actual_move_out_date', null) // Ensures we only update the active stay
    .select();

  if (error) throw new Error(error.message);
  return data;
}

// GET current occupants in a room (Logic for room.ts)
// Counts records where the student has not yet moved out.
export async function getRoomOccupantCount(roomId: number): Promise<number> {
  const { count, error } = await supabase
    .from('student_accommodation_history')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', roomId)
    .is('actual_move_out_date', null);

  if (error) throw new Error(error.message);
  return count ?? 0;
}