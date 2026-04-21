import { supabase } from "../supabase";
import { User, NewUser } from "@/models/user";
import { userData } from "@/data/user-data";
import { housingData } from "@/data/housing-data"

async function create(userDetails: NewUser): Promise<User> {
    // create system admin in system_admin table and user table

    const newUserData = await userData.create(userDetails);

    // Link to system_admin table
    const { data, error } = await supabase
        .from('system_admin')
        .insert({ account_number: newUserData.account_number })
        .select("*");

    if (error) throw new Error(error.message);

    return data[0];
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

// READ all users (manager, landlord, housing_admin, student)
async function getAllUsers() {
  return await userData.findAll();
}

// READ all housing 
async function getAllHousing() {
  return await housingData.findAll();
}

export const systemAdminData = {
  create,
  getById,
  update,
  getAllUsers,
  getAllHousing
}
