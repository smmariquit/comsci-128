import { supabase } from "@/app/lib/supabase";
import { User } from "@/app/lib/models/user";
import { createManager } from "@/app/lib/data/manager-data";
 
// Create housing admin
export async function createHousingAdmin(input: User, password: string ) {
  // Call createManager with manager_type "Housing Admin"
  // createManager internally calls createUser with user_type "Manager"
  const { accountNumber, error: managerError } = await createManager(input, password, "Housing Administrator");
 
  if (managerError || !accountNumber) {
    console.error("Error creating manager in createHousingAdmin:", managerError?.message);
    return { data: null, error: managerError };
  }
 
  // Insert into housing_admin
  const { data, error: adminError } = await supabase
    .from("housing_admin")
    .insert({ account_number: accountNumber })
    .select()
    .single();
 
  if (adminError) {
    console.error("Error inserting into housing_admin:", adminError.message);
    return { data: null, error: adminError };
  }
 
  return { data, error: null };
}
 
// Read all housing admins with user details
export async function getAllHousingAdmins() {
  const { data, error } = await supabase
    .from("housing_admin")
    .select(`
      account_number,
      manager:account_number (
        manager_type,
        user:account_number (
          account_number,
          account_email,
          first_name,
          middle_name,
          last_name,
          sex,
          birthday,
          home_address,
          phone_number,
          contact_email,
          user_type,
          is_deleted
        )
      )
    `);
 
  if (error) {
    console.error("Error fetching housing admins:", error.message);
    return { data: null, error };
  }
 
  return { data, error: null };
}
 
// Read single housing admin with user details by account_number
export async function getHousingAdminById(accountNumber: number) {
  const { data, error } = await supabase
    .from("housing_admin")
    .select(`
      account_number,
      manager:account_number (
        manager_type,
        user:account_number (
          account_number,
          account_email,
          first_name,
          middle_name,
          last_name,
          sex,
          birthday,
          home_address,
          phone_number,
          contact_email,
          user_type,
          is_deleted
        )
      )
    `)
    .eq("account_number", accountNumber)
    .single();
 
  if (error) {
    console.error("Error fetching housing admin:", error.message);
    return { data: null, error };
  }
 
  return { data, error: null };
}

//Delete housing admin (uncomment if needed)
// export async function deleteHousingAdmin(accountNumber: number) {
//   const { error } = await supabase
//     .from("housing_admin")
//     .delete()
//     .eq("account_number", accountNumber);
 
//   if (error) {
//     console.error("Error deleting from housing_admin:", error.message);
//     return { success: false, error };
//   }
 
//   return { success: true, error: null };
// }
