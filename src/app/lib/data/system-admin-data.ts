import { supabase } from "../supabase";
import { User, NewUser } from "@/models/user";
import { userData } from "@/data/user-data";

async function create(userDetails: NewUser): Promise<number | null> {
    // create system admin in system_admin table and user table

	const newUserData = await userData.create(userDetails);

    // Link to system_admin table
    const { data, error } = await supabase
        .from('system_admin')
        .insert({ account_number: newUserData.account_number })
        .select('account_number')
        .single();

    if (error) throw new Error(error.message);
    return data ? data.account_number : null;
}

async function getById(accountNumber: number) {
  const { data, error } = await supabase
    .from('system_admin')
    .select(`
      account_number,
      manager:account_number (
        manager_type,
        user:account_number (*)
      )
    `)
    .eq('account_number', accountNumber)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function update(accountNumber: number, updates: any) {
  const { data, error } = await supabase
    .from('system_admin')
    .update(updates)
    .eq('account_number', accountNumber)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export const systemAdminData = {
  create,
  getById,
  update
}