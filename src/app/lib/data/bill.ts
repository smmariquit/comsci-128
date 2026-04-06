import { supabase } from '../supabase';

// joins for FKs
// CREATE bill
export const createBill = async (billData: any) => {
  return await supabase.from('bill')
    .insert([billData])
    .select()
    .single();
};

// READ all bills
export const getAllBills = async () => {
  return await supabase.from('bill')
    .select('*, manager(*), student(*)') 
    .eq('is_deleted', false);
};

// READ bill using id
export const getBillById = async (transaction_id: number) => {
  return await supabase.from('bill')
    .select('*, manager(*), student(*)')
    .eq('transaction_id', transaction_id)
    .eq('is_deleted', false)
    .single(); 
};

// UPDATE bill
export const updateBill = async (transaction_id: number, updates: any) => {
  return await supabase.from('bill').update(updates)
    .eq('transaction_id', transaction_id)
    .select()
    .single();
};

// updates bill as paid
export const markBillAsPaid = async (transaction_id: number) => {
  return await supabase.from('bill')
    .update({ 
      status: 'Paid',
      date_paid: new Date().toISOString() 
    })
    .eq('transaction_id', transaction_id)
    .select()
    .single();
};

// DELETE bill 
export const deleteBill = async (transaction_id: number) => {
  return await supabase
    .from('bill')
    .update({ is_deleted: true })
    .eq('transaction_id', transaction_id);
};

// GET bills by manager
export const getBillsByManager = async (account_number: number) => {
  return await supabase.from('bill')
    .select('*, student(*)')
    .eq('manager_account_number', account_number)
    .eq('is_deleted', false);
};

// GET bills per student
export const getBillsByStudent = async (account_number: number) => {
  return await supabase.from('bill')
    .select('*, manager(*)')
    .eq('student_account_number', account_number)
    .eq('is_deleted', false);
};

// GET bills based on their payment status
export const getBillsByStatus = async (status: string) => {
  return await supabase.from('bill')
    .select('*, manager(*), student(*)')
    .eq('status', status)
    .eq('is_deleted', false);
};

// gets overdue bills
export const getOverdueBills = async () => {
  const today = new Date().toISOString();

  return await supabase.from('bill')
    .select('*, manager(*), student(*)')
    .lt('due_date', today)
    .eq('status', 'Pending')
    .eq('is_deleted', false);
};

// total balance per student
export const getTotalBalance = async (account_number: number) => {
  const { data, error } = await supabase.from('bill')
    .select('amount, status')
    .eq('student_account_number', account_number)
    .eq('is_deleted', false);

  const total = data?.reduce((sum:number, bill:any) => {
    if(bill.status=='Pending') {
      return sum + Number(bill.amount);
    }else {
      return sum;
    }
  }, 0);
  return total ?? 0;
};