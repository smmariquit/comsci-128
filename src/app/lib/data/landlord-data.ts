import { supabase } from "@/app/lib/supabase";
import { User, NewUser, UpdateUser } from "@/models/user";
import { Manager, NewManager, UpdateManager } from "@/models/manager";
import { createManager } from "@/app/lib/data/manager-data";

// promote User from Student to Housing Admin (Manager rather)
export async function createHousingAdmin(userDetails: NewUser, managerDetails: NewManager) {
  // managerDetails.manager_type must already be set to "Housing Admin"

  const newManagerData = await createManager(
		userDetails,
    managerDetails,
	);

	// if (managerError || !newManagerData) {
	// 	console.error(
	// 		"Error creating manager in createHousingAdmin:",
	// 		managerError?.message,
	// 	);
	// 	return { data: null, error: managerError };
	// }

  managerDetails.account_number = newManagerData.account_number

	// Insert into housing_admin
	const { data, error: adminError } = await supabase
		.from("housing_admin")
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

// Read all housing admins with user details
export async function getAllHousingAdmins() {
	const { data, error } = await supabase.from("housing_admin").select(`
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
		.select(
			`
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
    `,
		)
		.eq("account_number", accountNumber)
		.single();

	if (error) {
		console.error("Error fetching housing admin:", error.message);
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

export async function getGrossRevenueByLandlord(accountNumber: number) {
	const { data: tenants, error: tenantError } = await supabase
		.from("student_accommodation_history")
		.select(
			`
        account_number,
        room:room_id!inner(
          housing:housing_id!inner(landlord_account_number)
        )
      `,
		)
		.eq("room.housing.landlord_account_number", accountNumber);

	if (tenantError) {
		console.error(
			"Error fetching tenants for revenue:",
			tenantError.message,
		);
		return { data: null, error: tenantError };
	}

	const studentIds = [
		...new Set(tenants?.map((t) => t.account_number) ?? []),
	];

	if (studentIds.length === 0) {
		return { data: 0, error: null };
	}

	const { data: bills, error: billError } = await supabase
		.from("bill")
		.select("amount")
		.in("student_account_number", studentIds)
		.eq("is_deleted", false);

	if (billError) {
		console.error("Error fetching bills for revenue:", billError.message);
		return { data: null, error: billError };
	}

	const grossRevenue = bills?.reduce(
		(sum, bill) => sum + Number(bill.amount),
		0,
	) ?? 0;

	return { data: grossRevenue, error: null };
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
