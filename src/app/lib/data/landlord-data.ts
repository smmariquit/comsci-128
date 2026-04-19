import { supabase } from "@/app/lib/supabase";
import { User, NewUser, UpdateUser } from "@/models/user";
import { Manager, NewManager, UpdateManager } from "@/models/manager";
import { managerData } from "@/app/lib/data/manager-data";

async function create(userDetails: NewUser, managerDetails: NewManager) {
  // Call createManager with manager_type "Landlord"
  // createManager internally calls createUser with user_type "Manager"
  const newManagerData = await managerData.create(
    userDetails,
    managerDetails,
  );

	managerDetails.account_number = newManagerData.account_number;

  // Insert into housing_admin
  const { data, error: adminError } = await supabase
    .from("landlord")
    .insert([managerDetails])
    .select();

  if (adminError) {
    console.error(
      "Error inserting into housing_admin:",
      adminError.message,
    );
    return { data: null, error: adminError };
  }

  return data[0];
}
 
// Read all landlords with user details
async function getAll() {
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
async function getById(accountNumber: number) {
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

async function getPendingAdminApplications(landlordAccountNumber: number) {
  // get the list of applications with status = "Pending Admin Approval"
  // get the count of applications with the same status
  
  const { data: listOfPending, count: totalPending, error } = await supabase
    .from("application")
    .select(`
        *,
        user!inner(*)
      `,
      { count: 'exact' }
    )
    .eq("application.application_status", "Pending Admin Approval")
    .eq("appplication.landlord_account_number", landlordAccountNumber)
    .eq("is_deleted", false);

  if (error) throw new Error(`getAccommodatio nHistoryOfStudent Error: ${error.message}`);
  
  return { listOfPending, totalPending };
}

export const landlordData = {
  create,
  getAll,
  getById,
  getPendingAdminApplications
};
