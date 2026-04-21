import { supabase } from "../supabase";
import { User, NewUser, UpdateUser } from "@/models/user";
import { Housing } from "@/models/housing"
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

async function getById(accountNumber: number): Promise<User | null> {
  const { data, error } = await supabase
    .from('system_admin')
    .select(`
      account_number,
      manager:account_number (
        manager_type,
        user:account_number (*)
      )
    `)
    .eq('account_number', accountNumber);

  if (error) throw new Error(error.message);

  return data && data.length > 0 ? data[0] : null;
}

async function update(accountNumber: number, updates: UpdateUser): Promise<User> {
  const { data, error } = await supabase
    .from('system_admin')
    .update(updates)
    .eq('account_number', accountNumber)
    .select();

  if (error) throw new Error(error.message);
  
  return data[0];
}

// READ all users (manager, landlord, housing_admin, student)
async function getAllUsers(): Promise<User[]> {
  return await userData.findAll();
}

// READ all housing 
async function getAllHousing(): Promise<Housing[]> {
  return await housingData.findAll();
}

export const systemAdminData = {
  create,
  getById,
  update,
  getAllUsers,
  getAllHousing
}
