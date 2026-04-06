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
    .eq('is_deleted', false);

  if (error) throw error;

  const total = data?.reduce((sum, bill) => {
    return bill.status === 'Pending' ? sum + Number(bill.amount) : sum;
  }, 0);

  return {
    student: data?.[0]?.student,
    totalBalance: total ?? 0,
    bills: data
  };
};