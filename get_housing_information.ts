import { supabase } from '../supabase';

//Active Housing Information
//Get information of housing
//Entities: student, student_accommodation_history, room, housing

export const getStudentActiveHousing = async (account_number: number) => {
  const { data, error } = await supabase
    .from('student_accommodation_history')
    .select(`
      move_in_date,
      expected_move_out_date,
      status,
      student:account_number (
        account_number
      ),
      room (
        room_id,
        room_type,
        housing (
          housing_name,
          housing_address
        )
      )
    `)
    .eq('account_number', account_number)
    .is('actual_move_out_date', null)
    .single();

  if (error) throw error;

  return data;
};

