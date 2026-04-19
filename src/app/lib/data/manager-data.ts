import { supabase } from "../supabase";
import { NewUser } from "@/models/user";
import { Manager, NewManager } from "@/models/manager";
import { Housing} from "@/models/housing";
import { userData } from "./user-data";

const create = async (
	userDetails: NewUser,
	managerDetails: NewManager
): Promise<Manager> => {
  // CREATE row in "manager" table & RETURN the created manager object

	const newUserData = await userData.create(userDetails);

  managerDetails.account_number = newUserData.account_number;

  const { data, error } = await supabase
    .from("manager")
    .insert([managerDetails])
    .select();

  if (error) throw error;

  return data[0];
};

// READ managers
const getAll = async () => {
	return await supabase
		.from("manager")
		.select(`*, "user" (*)`)
		.eq("is_deleted", false);
};

// FIND manager by ID
const findById = async (account_number: number) => {
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
const update = async (account_number: number, updates: any) => {
	return await supabase
		.from("manager")
		.update(updates)
		.eq("account_number", account_number)
		.select()
		.single();
};

// DELETE manager (soft delete only)
const deactivate = async (account_number: number) => {
	return await supabase
		.from("manager")
		.update({ is_deleted: true })
		.eq("account_number", account_number)
		.select()
		.single();
};

// manager_bank

// CREATE manager bank
const createBankDetails = async (bankData: any) => {
	return await supabase
		.from("manager_bank")
		.insert([bankData])
		.select()
		.single();
};

// READ banks using manager
const getBanks = async (account_number: number) => {
	return await supabase
		.from("manager_bank")
		.select("*")
		.eq("account_number", account_number)
		.eq("is_deleted", false);
};

// UPDATE banks
const updateBankDetails = async (bank_number: number, updates: any) => {
	return await supabase
		.from("manager_bank")
		.update(updates)
		.eq("bank_number", bank_number)
		.select()
		.single();
};

// DELETE bank (soft Delete)
const deleteBankDetails = async (bank_number: number) => {
	return await supabase
		.from("manager_bank")
		.update({ is_deleted: true })
		.eq("bank_number", bank_number)
		.select()
		.single();
};

// CREATE manager_payment
const addPaymentDetails = async (paymentData: any) => {
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
const getPaymentDetails = async () => {
	return await supabase
		.from("manager_payment_details")
		.select(`*, manager (*), bill (*)`)
		.eq("is_deleted", false);
};

// UPDATE payments
const updatePaymentDetails = async (id: number, updates: any) => {
	return await supabase
		.from("manager_payment_details")
		.update(updates)
		.eq("id", id)
		.select()
		.single();
};

// DELETE payments
const deletePaymentDetails = async (id: number) => {
	return await supabase
		.from("manager_payment_details")
		.update({ is_deleted: true })
		.eq("id", id)
		.select()
		.single();
};

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

export const managerData = {
	create,
	getAll,
	findById,
	update,
	deactivate,
	createBankDetails,
	getBanks,
	updateBankDetails,
	deleteBankDetails,
	addPaymentDetails,
	getPaymentDetails,
	updatePaymentDetails,
	deletePaymentDetails,
	getUnassignedApprovedApplicants
}
