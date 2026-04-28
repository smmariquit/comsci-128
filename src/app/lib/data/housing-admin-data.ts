import { supabase } from "@/app/lib/supabase";
import { User, NewUser, UpdateUser } from "@/models/user";
import { Manager, NewManager, UpdateManager } from "@/models/manager";
import { managerData } from "@/app/lib/data/manager-data";

// promote User from Student to Housing Admin (Manager rather)
async function create(
  account_number:number, 
  managerDetails: NewManager) {
  // managerDetails.manager_type must already be set to "Housing Admin"

  await managerData.create( account_number, managerDetails,);

	// Insert into housing_admin
	const { data, error: adminError } = await supabase
		.from("housing_admin")
		.insert([{account_number}])
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
async function getAll() {
	const { data, error } = await supabase.from("housing_admin").select(`
      account_number,
      manager!inner(
        manager_type,
        user!inner(
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
          user_type
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
async function getById(accountNumber: number) {
	const { data, error } = await supabase
		.from("housing_admin")
		.select(
			`
      account_number,
      manager!inner (
        manager_type,
        user!inner (
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

// List of pending applications based on managed housings of a manager
// Involves: application, student, manager, housing (optional grouping)
async function getPendingManagerApplications(managerAccountNumber: number) {
  const { data, error } = await supabase
    .from("application")
    .select(`
      application_id,
      application_status,
      housing_name,
      preferred_room_type,
      expected_moveout_date,
      student!inner (
        account_number,
        student_number,
        housing_status,
        user!inner (
          first_name,
          middle_name,
          last_name,
          account_email
        )
      ),
      manager!inner (
        account_number
      )
    `)
    .eq("application_status", "Pending Manager Approval")
    .eq("manager_account_number", managerAccountNumber)
    .eq("is_deleted", false);

  if (error) {
    console.error("Error fetching pending applications by manager:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

export const housingAdminData = {
  create,
  getAll,
  getById,
  getPendingManagerApplications
};
