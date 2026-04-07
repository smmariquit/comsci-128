import { supabase } from "../supabase";
import { User, NewUser, UpdateUser } from "@/models/user";
import { Manager, NewManager, UpdateManager } from "@/models/manager";
import { Housing} from "@/models/housing";
import { userData } from "./user-data";

export const createManager = async (
	userDetails: NewUser,
	managerDetails: NewManager
): Promise<Manager> => {
	// CREATE row in "manager" table & RETURN the created manager object

	const newUserData = await userData.createUser(userDetails);

	managerDetails.account_number = newUserData.account_number;

	const { data, error } = await supabase
		.from("manager")
		.insert([managerDetails])
		.select();

	if (error) throw error;

	return data[0];
};

// READ managers
export const getManagers = async () => {
	return await supabase
		.from("manager")
		.select(`*, "user" (*)`)
		.eq("is_deleted", false);
};

// FIND manager by ID
export const findManagerById = async (account_number: number) => {
	const { data, error } = await supabase
		.from("manager")
		.select(`*, "user" (*)`)
		.eq("account_number", account_number)
		.eq("is_deleted", false)
		.single();

	if (error) return null;
	return data;
};

// UPDATE manager
export const updateManager = async (account_number: number, updates: any) => {
	return await supabase
		.from("manager")
		.update(updates)
		.eq("account_number", account_number)
		.select()
		.single();
};

// DELETE manager (soft delete only)
export const deleteManager = async (account_number: number) => {
	return await supabase
		.from("manager")
		.update({ is_deleted: true })
		.eq("account_number", account_number)
		.select()
		.single();
};

// manager_bank

// CREATE manager bank
export const createManagerBank = async (bankData: any) => {
	return await supabase
		.from("manager_bank")
		.insert([bankData])
		.select()
		.single();
};

// READ banks using manager
export const getManagerBanks = async (account_number: number) => {
	return await supabase
		.from("manager_bank")
		.select("*")
		.eq("account_number", account_number)
		.eq("is_deleted", false);
};

// UPDATE banks
export const updateManagerBank = async (bank_number: number, updates: any) => {
	return await supabase
		.from("manager_bank")
		.update(updates)
		.eq("bank_number", bank_number)
		.select()
		.single();
};

// DELETE bank (soft Delete)
export const deleteManagerBank = async (bank_number: number) => {
	return await supabase
		.from("manager_bank")
		.update({ is_deleted: true })
		.eq("bank_number", bank_number)
		.select()
		.single();
};

// manager_payment_details

// CREATE manager_payment
export const createPayment = async (paymentData: any) => {
	const { transaction_id } = paymentData;

	const { data: res, error } = await supabase
		.from("manager_payment_details")
		.insert([paymentData])
		.select()
		.single();

	// UPDATE bills after payment
	const { error: billError } = await supabase
		.from("bill")
		.update({
			status: "Paid",
			date_paid: new Date().toISOString(),
		})
		.eq("transaction_id", transaction_id);

	if (billError) throw billError;

	return res;
};

// READ payments
export const getPayments = async () => {
	return await supabase
		.from("manager_payment_details")
		.select(`*, manager (*), bill (*)`)
		.eq("is_deleted", false);
};

// UPDATE payments
export const updatePayment = async (id: number, updates: any) => {
	return await supabase
		.from("manager_payment_details")
		.update(updates)
		.eq("id", id)
		.select()
		.single();
};

// DELETE payments
export const deletePayment = async (id: number) => {
	return await supabase
		.from("manager_payment_details")
		.update({ is_deleted: true })
		.eq("id", id)
		.select()
		.single();
};

export async function getHousingDetailsofStudent(studentAccountNumber: number) {
	// get the details of the housing and room of a student given a student's account number
	
	const { data: studentHousingDetails, error } = await supabase
		.from("housing")
		.select(`
			*,
			room!inner(*),
			student_accommodation_history!inner(*)
		`)
		.eq("student_accommodation_history.account_number", studentAccountNumber);

	if (error) throw new Error(`getHousingDetailsofStudent Error: ${error.message}`);

	return studentHousingDetails;
}

// List of approved applicants that have no room assigned yet
// Involves: user, student, application, manager
export async function getUnassignedApprovedApplicants(managerAccountNumber: number) {
  const { data, error } = await supabase
    .from("application")
    .select(`
      application_id,
      application_status,
      expected_moveout_date,
      actual_moveout_date,
      housing_name,
      preferred_room_type,
      room_id,
      student:student_account_number (
        account_number,
        student_number,
        user:account_number (
          first_name,
          middle_name,
          last_name,
          account_email
        )
      ),
      manager:manager_account_number (
        account_number
      )
    `)
    .eq("application_status", "Approved")
    .is("room_id", null)                          // unassigned — no room yet
    .eq("manager_account_number", managerAccountNumber)
    .eq("is_deleted", false);

  if (error) {
    console.error("Error fetching unassigned approved applicants:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}

// Total rooms managed by a housing admin
// Involves: manager, housing, room
export async function getTotalRoomsByManager(managerAccountNumber: number) {
  const { data, error } = await supabase
    .from("housing")
    .select(`
      housing_id,
      housing_name,
      housing_address,
      housing_type,
      rent_price,
      room:room (
        room_id,
        room_type,
        occupancy_status,
        payment_status,
        maximum_occupants
      )
    `)
    .eq("manager_account_number", managerAccountNumber)
    .eq("is_deleted", false);

  if (error) {
    console.error("Error fetching total rooms by manager:", error.message);
    return { data: null, error, totalRooms: 0 };
  }

  // Count total rooms across all housings
  const totalRooms = data?.reduce((acc, housing) => {
    return acc + (housing.room?.length ?? 0);
  }, 0) ?? 0;

  return { data, totalRooms, error: null };
}


// Total tenants managed by a manager
// Involves: manager, housing, room, student_accommodation_history
export async function getTotalTenantsByManager(managerAccountNumber: number) {
  const { data, error } = await supabase
    .from("housing")
    .select(`
      housing_id,
      housing_name,
      room:room (
        room_id,
        room_type,
        occupancy_status,
        maximum_occupants,
        student_accommodation_history:student_accommodation_history (
          account_number,
          movein_date,
          moveout_date
        )
      )
    `)
    .eq("manager_account_number", managerAccountNumber)
    .eq("is_deleted", false);

  if (error) {
    console.error("Error fetching total tenants by manager:", error.message);
    return { data: null, error, totalTenants: 0 };
  }

  // Count total tenants across all rooms
  const totalTenants = data?.reduce((acc, housing) => {
    const tenantsInHousing = housing.room?.reduce((roomAcc: number, room: any) => {
      return roomAcc + (room.student_accommodation_history?.length ?? 0);
    }, 0) ?? 0;
    return acc + tenantsInHousing;
  }, 0) ?? 0;

  return { data, totalTenants, error: null };
}

// List of pending applications based on managed housings of a manager
// Involves: application, student, manager, housing (optional grouping)
export async function getPendingApplicationsByManager(managerAccountNumber: number) {
  const { data, error } = await supabase
    .from("application")
    .select(`
      application_id,
      application_status,
      housing_name,
      preferred_room_type,
      expected_moveout_date,
      student:student_account_number (
        account_number,
        student_number,
        housing_status,
        user:account_number (
          first_name,
          middle_name,
          last_name,
          account_email
        )
      ),
      manager:manager_account_number (
        account_number
      )
    `)
    .eq("application_status", "Pending")
    .eq("manager_account_number", managerAccountNumber)
    .eq("is_deleted", false);

  if (error) {
    console.error("Error fetching pending applications by manager:", error.message);
    return { data: null, error };
  }

  return { data, error: null };
}
