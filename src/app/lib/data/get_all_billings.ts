import { supabase } from '../supabase';

export const getAllBillings = async () => {
  const { data, error } = await supabase
    .from('bill')
    .select(`
      transaction_id,
      amount,
      status,
      due_date,
      is_deleted,
      student:student_account_number (
        account_number,
        user:account_number (
          first_name,
          last_name,
          account_email
        ),
        student_accommodation_history (
          room:room_id (
            room_id,
            housing:housing_id (
              housing_name,
              manager:manager_account_number (
                account_number,
                user:account_number (
                  first_name, 
                  last_name
                )
              )
            )
          )
        )
      )
    `)
    .eq('is_deleted', false)
    .order('due_date', { ascending: false });

  if (error) throw error;
  

  return data;
};