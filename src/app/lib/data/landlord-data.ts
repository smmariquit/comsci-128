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

async function getTotalRoomsManaged(accountNumber: number) {
	const { count, error } = await supabase
		.from("room")
		.select(
			`
        room_id,
        housing:housing_id!inner(landlord_account_number)
      `,
			{ count: "exact", head: true },
		)
		.eq("housing.landlord_account_number", accountNumber)
		.eq("is_deleted", false);

	if (error) {
		console.error("Error counting rooms by landlord:", error.message);
	}
}

async function getTotalProperties(accountNumber: number) {
	const { count, error } = await supabase
		.from("housing")
		.select("housing_id", { count: "exact", head: true })
		.eq("landlord_account_number", accountNumber)
		.eq("is_deleted", false);

	if (error) {
		console.error("Error counting properties by landlord:", error.message);
		return { data: null, error };
	}

	return { data: count ?? 0, error: null };
}

// Count the number of students who are in a dormitory that is managed by a certain landlord number
async function getTotalTenantsManaged(accountNumber: number) {
	const { count, error } = await supabase
		.from("student_accommodation_history")
		.select(
			`
        account_number,
        room:room_id!inner(
          housing:housing_id!inner(landlord_account_number)
        )
      `,
			{ count: "exact", head: true },
		)
		.eq("room.housing.landlord_account_number", accountNumber);

	if (error) {
		console.error("Error counting tenants by landlord:", error.message);
		return { data: null, error };
	}

	return { data: count ?? 0, error: null };
}

async function getGrossRevenue(accountNumber: number) {
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

export const landlordData = {
  create,
  getAll,
  getById,
  getPendingAdminApplications,
  getTotalRoomsManaged,
  getTotalProperties,
  getTotalTenantsManaged,
  getGrossRevenue
};
