import { supabase } from "@/app/lib/supabase";
import { User, NewUser } from "@/app/lib/models/user";

// Read all housing admins with user details
export async function getAllHousingAdmins() {
  const { data, error } = await supabase
    .from("housing_admin")
    .select(`
      account_number,
      manager:housing_admin_account_number_fkey (
        manager_type,
        user:manager_account_number_fkey (
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
