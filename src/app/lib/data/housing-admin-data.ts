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