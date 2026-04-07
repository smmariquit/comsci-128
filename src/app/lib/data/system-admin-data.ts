import { supabase } from "@/lib/supabase";
import { User, NewUser, UpdateUser } from "@/models/user";
import { Manager, NewManager, UpdateManager } from "@/models/manager";
import { userData } from "@/data/user-data";
import { housingData } from "@/data/housing-data";
import { 
  createManager, 
  createManagerBank, 
  createPayment 
} from "@/data/manager-data";

// CREATE System Admin

export async function createSystemAdmin(userDetails: NewUser, managerDetails: NewManager) {
    // managerDetails.manager_type must already be set to "System Admin"

    const newManagerData = await createManager(userDetails, managerDetails);

    managerDetails.account_number = newManagerData.account_number

    // Insert into housing_admin
    const { data, error } = await supabase
        .from("system_admin")
        .insert([managerDetails])
        .select();

    if (error) {
        console.error(
            "Error inserting into housing_admin:",
            error.message,
        );
        return { data: null, error: error };
    }

    return data[0];
}

//READ: Get System Admin 
export async function getSystemAdminById(accountNumber: number) {
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

// UPDATE for admin-specific fields
export async function updateSystemAdmin(accountNumber: number, updates: any) {
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
export async function getSystemAdminAllUsers() {
  return await userData.findAllUsers();
}

// READ all housing 
export async function getSystemAdminAllHousing() {
  return await housingData.findAll();
}

