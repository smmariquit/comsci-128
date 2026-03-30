import { supabase } from "@/app/lib/supabase";
import { User } from "@/app/lib/models/user";
import { createManager } from "@/app/lib/data/manager-data";
 

//Create landlord
export async function createLandlord(input: User, password : string) {
  // Call createManager with manager_type "Landlord"
  // createManager internally calls createUser with user_type "Manager"
  const { accountNumber, error: managerError } = await createManager(input, password, "Landlord");
 
  if (managerError || !accountNumber) {
    console.error("Error creating manager in createLandlord:", managerError?.message);
    return { data: null, error: managerError };
  }
 
 
  // Insert into landlord
  const { data, error: landlordError } = await supabase
    .from("landlord")
    .insert({ account_number: accountNumber })
    .select()
    .single();
 
  if (landlordError) {
    console.error("Error inserting into landlord:", landlordError.message);
    return { data: null, error: landlordError };
  }
 
  return { data, error: null };
}
 
// Read all landlords with user details
export async function getAllLandlords() {
  const { data, error } = await supabase
    .from("landlord")
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
    console.error("Error fetching landlords:", error.message);
    return { data: null, error };
  }
 
  return { data, error: null };
}
 
// Read single landlord with user details by account_number
export async function getLandlordById(accountNumber: number) {
  const { data, error } = await supabase
    .from("landlord")
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
    console.error("Error fetching landlord:", error.message);
    return { data: null, error };
  }
 
  return { data, error: null };
}
 
//Delete landlord (Uncomment if needed)
// export async function deleteLandlord(accountNumber: number) {
//   const { error } = await supabase
//     .from("landlord")
//     .delete()
//     .eq("account_number", accountNumber);
 
//   if (error) {
//     console.error("Error deleting from landlord:", error.message);
//     return { success: false, error };
//   }
 
//   return { success: true, error: null };
// }
 