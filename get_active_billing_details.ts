import { supabase } from '../supabase';

//Active Billing Details (Currently Unpaid)
//Get the list of all pending/overdue bills of a student
//Entities: student, bill, manager, housing

export const getStudentUnpaidBills = async (account_number: number) => {
    const { data, error } = await supabase
      .from('bill')
      .select(`
        transaction_id,
        amount,
        bill_type,
        due_date,
        status,
        manager (
          user:account_number (
            first_name,
            last_name,
            email
          )
        )
      `)
      .eq('student_account_number', account_number)
      .in('status', ['Pending', 'Overdue'])
      .eq('is_deleted', false)
      .order('due_date', { ascending: true });
  
    if (error) throw error;
  
    return data;
  };