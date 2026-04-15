import { supabase } from "@/app/lib/supabase";
import { User, NewUser } from "@/app/lib/models/user";
 
// Read all landlords with user details
export async function getAllLandlords() {
  const { data, error } = await supabase
    .from("landlord")
    .select(`
      account_number,
      manager:landlord_account_number_fkey (
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

// Count the number of students who are in a dormitory that is managed by a certain landlord number
export async function getTotalTenantsByLandlord(accountNumber: number) {
	const { count, error } = await supabase
		.from("student_accommodation_history")
		.select(
			`
        account_number,
        room:room_id!inner(
          housing:housing_id!inner(manager_account_number)
        )
      `,
			{ count: "exact", head: true },
		)
		.eq("room.housing.manager_account_number", accountNumber);

	if (error) {
		console.error("Error counting tenants by landlord:", error.message);
		return { data: null, error };
	}

	return { data: count ?? 0, error: null };
}

//Delete housing admin (uncomment if needed)
// export async function deleteHousingAdmin(accountNumber: number) {
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
 