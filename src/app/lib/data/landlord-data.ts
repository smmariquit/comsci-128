import { supabase } from "@/app/lib/supabase";
import { User, NewUser, UpdateUser } from "@/models/user";
import { Manager, NewManager, UpdateManager } from "@/models/manager";
import { managerData } from "@/app/lib/data/manager-data";

// ============================================
// Define safe fields to NEVER select from user table
// ============================================
const SENSITIVE_USER_FIELDS = ['password', 'google_identity'] as const;

// Safe user fields (excludes password and google_identity)
const SAFE_USER_FIELDS = `
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
  is_deleted,
  profile_picture
` as const;

// Safe manager fields
const SAFE_MANAGER_FIELDS = `
  manager_type
` as const;

// Helper function to sanitize user data
function sanitizeUserData(userData: any) {
  if (!userData) return null;
  const { password, google_identity, ...safeUser } = userData;
  return safeUser;
}

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
        ${SAFE_MANAGER_FIELDS},
        user:manager_account_number_fkey (
          ${SAFE_USER_FIELDS}
        )
      )
    `);

	if (error) {
		console.error("Error fetching landlords:", error.message);
		return { data: null, error };
	}

	// Sanitize user data in the response
	if (data) {
		const sanitizedData = data.map((item: any) => ({
			...item,
			manager: item.manager ? {
				...item.manager,
				user: sanitizeUserData(item.manager.user)
			} : null
		}));
		return { data: sanitizedData, error: null };
	}

	return { data, error: null };
}

// Read single landlord with user details by account_number
async function getById(accountNumber: number) {
	const { data, error } = await supabase
		.from("landlord")
		.select(`
			account_number,
			manager!inner (
				${SAFE_MANAGER_FIELDS},
				user!inner (
					${SAFE_USER_FIELDS}
				)
			)
		`)
		.eq("account_number", accountNumber)
		.eq("is_deleted", false)
		.single();

	if (error) {
		console.error("Error fetching landlord:", error.message);
		return { data: null, error };
	}

	// Sanitize user data in the response
	if (data) {
		const sanitizedData = {
			...data,
			manager: data.manager ? {
				...data.manager,
				user: sanitizeUserData(data.manager.user)
			} : null
		};
		return { data: sanitizedData, error: null };
	}

	return { data, error: null };
}

// Count the number of students who are in a dormitory that is managed by a certain landlord number
async function getTotalTenantsByLandlord(accountNumber: number) {
	const { count, error } = await supabase
		.from("student_accommodation_history")
		.select(`
			account_number,
			room!inner(
				housing!inner(manager_account_number)
			)
		`, { count: "exact", head: true })
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
//     .from("housing_admin")
//     .delete()
//     .eq("account_number", accountNumber);

// Count the number of students who are in a dormitory that is managed by a certain landlord number
async function getTotalTenantsManaged(accountNumber: number) {
	const { count, error } = await supabase
		.from("student_accommodation_history")
		.select(`
			account_number,
			room!inner(
				housing!inner(landlord_account_number)
			)
      	`, { count: "exact", head: true }
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
		.select(`
			account_number,
			room!inner(
			housing!inner(landlord_account_number)
			)
      	`)
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

	const grossRevenue =
		bills?.reduce((sum, bill) => sum + Number(bill.amount), 0) ?? 0;

	return { data: grossRevenue, error: null };
}

async function getTotalRoomsManaged(accountNumber: number) {
	const { count, error } = await supabase
		.from("room")
		.select(`
			housing!inner(
				landlord_account_number
			)
		`, { count: "exact", head: true })
		.eq("housing.landlord_account_number", accountNumber);
	return { data: count ?? 0, error };
}

async function getTotalProperties(accountNumber: number) {
	const { count, error } = await supabase
		.from("housing")
		.select("*", { count: "exact", head: true })
		.eq("landlord_account_number", accountNumber);
	return { data: count ?? 0, error };
}

async function getPendingAdminApplications(accountNumber: number) {
	const { count, error } = await supabase
		.from("application")
		.select("*", { count: "exact", head: true })
		.eq("landlord_account_number", accountNumber)
		.eq("application_status", "Pending Admin Approval");
	return { data: count ?? 0, error };
}

export const landlordData = {
	create,
	getAll,
	getById,
	getPendingAdminApplications,
	getTotalTenantsByLandlord,
	getTotalRoomsManaged,
	getTotalProperties,
	getTotalTenantsManaged,
	getGrossRevenue,
};