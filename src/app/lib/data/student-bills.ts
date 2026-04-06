import { supabase } from '../supabase';

export const getStudentBalance = async (account_number: number) => {
  const { data, error } = await supabase
    .from('bill')
    .select(`
      transaction_id,
      amount, 
      status,
      student:student_account_number (
        user:account_number (first_name, last_name)
      ),
      manager:manager_id (
        user:account_number (last_name)
      )
    `)
    .eq('account_number', account_number)
    .eq('is_deleted', false)
    .in('status', ['Pending', 'Overdue']);

  if (error) throw error;

  const total = data?.reduce((sum, bill) => {
    return sum + Number(bill.amount);
  }, 0);

  return {
    student: data?.[0]?.student || null,
    totalBalance: total ?? 0,
    bills: data
  };
};
