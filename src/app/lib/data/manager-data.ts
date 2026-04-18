import type { Manager, ManagerProfile, NewManager } from "@/models/manager";
import type { NewUser } from "@/models/user";
import { supabase } from "../supabase";
import { userData } from "./user-data";

export const createManager = async (
	userDetails: NewUser,
	managerDetails: NewManager,
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

const findManagerProfileById = async (
	account_number: number,
): Promise<ManagerProfile | null> => {
	const { data, error } = await supabase
		.from("user")
		.select(
			`
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
            profile_picture,
            user_type,
            manager:manager_account_number_fkey(
                account_number,
                manager_type,
                manager_payment_details:manager_payment_details_account_number_fkey(
                    account_number,
                    bank_number,
                    bank_type
                )
            )
            `,
		)
		.eq("account_number", account_number)
		.eq("is_deleted", false)
		.single();

	if (error) {
		console.error("Error fetching student profile:", error);
		return null;
	}

	return data;
};

// UPDATE manager
const updateManager = async (account_number: number, updates: any) => {
	const { data, error } = await supabase
		.from("manager")
		.update(updates)
		.eq("account_number", account_number)
		.select()
		.single();

	if (error) {
		console.error("Error fetching student profile:", error);
		return null;
	}

	return data;
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
const updatePayment = async (id: number, updates: any) => {
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

export const managerData = {
	findManagerProfileById,
	updateManager,
	updatePayment,
};
