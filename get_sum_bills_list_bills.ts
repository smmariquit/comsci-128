import { supabase } from '../supabase';

//Billing Summary
//Get the sum of all pending bills and (Separate) list of bills (price, bill type)
//Entities: student, bill, manager

export const getStudentBillingSummary = async (account_number: number) => {
  const { data, error } = await supabase
    .from('bill')
    .select(`
      transaction_id,
      amount,
      status,
      due_date,
      bill_type,
      manager (
        manager_type,
        user:account_number (
          first_name,
          last_name
        )
      )
    `)
    .eq('student_account_number', account_number)
    .eq('is_deleted', false);

  if (error) throw error;

  // Calculate total balance for Pending and Overdue bills
  const total_outstanding = data
    ?.filter((bill: any) => bill.status === 'Pending' || bill.status === 'Overdue')
    ?.reduce((sum: number, bill: any) => sum + Number(bill.amount), 0) || 0;

  // Detailed list including price and bill type
  const breakdown = data.map((bill: any) => ({
    id: bill.transaction_id,
    amount: bill.amount,
    bill_type: bill.bill_type,
    status: bill.status,
    due_date: bill.due_date,
    pay_to: `${bill.manager?.user?.first_name} ${bill.manager?.user?.last_name}`,
    manager_role: bill.manager?.manager_type
  }));

  return {
    total_outstanding,
    breakdown
  };
};