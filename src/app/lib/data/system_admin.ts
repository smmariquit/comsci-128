import { supabase } from "../supabase";
import { User } from "@/models/user";
import { getAllUsers } from "./user";
import { findAllHousing } from "./housing";
import { 
  createManager, 
  createManagerBank, 
  createPayment 
} from "./manager";

// CREATE System Admin
export async function createSystemAdmin(
  userDetails: User, 
  password: string, 
  bankData: any, 
  paymentData: any
): Promise<number | null> {
  
  // Create the Manager base
  const manager = await createManager(userDetails, password, "System Administrator");
  
  if (!manager) throw new Error("Manager creation failed");
  const accountNumber = manager.account_number;

  // Create Bank details
  await createManagerBank({ ...bankData, account_number: accountNumber });

  // Create Payment details
  await createPayment({ ...paymentData, account_number: accountNumber });

  // Link to system_admin table
  const { data, error } = await supabase
    .from('system_admin')
    .insert({ account_number: accountNumber })
    .select('account_number')
    .single();

  if (error) throw new Error(error.message);
  return data ? data.account_number : null;
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
  return await getAllUsers();
}

// READ all housing 
export async function getSystemAdminAllHousing() {
  return await findAllHousing();
}