import { supabase } from '../supabase';

//Billing History
//Get the list of all bills of a student (regardless of bill status)
//Entities: student, bill, manager, housing

export const getStudentBillingHistory = async (account_number: number) => {
    const { data, error } = await supabase
      .from('bill')
      .select(`
        transaction_id,
        amount,
        bill_type,
        status,
        date_paid,
        due_date,
        manager (
          user:account_number (
            first_name,
            last_name
          )
        )
      `)
      .eq('student_account_number', account_number)
      .eq('is_deleted', false)
      .order('due_date', { ascending: false });
  
    if (error) throw error;
  
    return data;
  };