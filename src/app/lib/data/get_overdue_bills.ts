import { supabase } from '../supabase';

const TODAY = new Date().toISOString();

// overdue or unpaid bills per student
export const getOverdueByStudent = async (student_account_number: number) => {
  return await supabase
    .from('bill')
    .select(`
      *,
      student:student_account_number(
        user:account_number(first_name, last_name),
        student_accommodation_history (
          room:room_id (room_id, housing:housing_id (housing_name))
        )
      ),
      manager:manager_account_number(user:account_number (first_name, last_name))
    `)
    .eq('student_account_number', student_account_number)
    .in('status', ['Pending', 'Overdue'])
    .lt('due_date', TODAY)
    .eq('is_deleted', false);
};

