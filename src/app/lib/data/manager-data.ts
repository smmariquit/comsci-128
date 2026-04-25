import { supabase } from "../supabase";
import type { Manager, ManagerProfile, NewManager } from "@/models/manager";
import type { NewUser } from "@/models/user";
import { Housing } from "@/models/housing";
import { userData } from "./user-data";

const create = async (
	userDetails: NewUser,
	managerDetails: NewManager,
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
		.select(`*, user!inner(*)`)
		.eq("is_deleted", false);
};

// FIND manager by ID
const findById = async (account_number: number) => {
	const { data, error } = await supabase
		.from("manager")
		.select(`*, user!inner(*)`)
		.eq("account_number", account_number)
		.eq("is_deleted", false);

	if (error) return null;
	return data[0];
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

	const manager = Array.isArray(data.manager)
		? data.manager[0]
		: data.manager;

	if (!manager) return null;

	return {
		...data,
		manager: {
			...manager,
			manager_payment_details: Array.isArray(
				manager.manager_payment_details,
			)
				? manager.manager_payment_details
				: manager.manager_payment_details
					? [manager.manager_payment_details]
					: [],
		},
	};
};

// UPDATE manager
const update = async (account_number: number, updates: any) => {
	return await supabase
		.from("manager")
		.update(updates)
		.eq("account_number", account_number)
		.select();
};

// DELETE manager (soft delete only)
const deactivate = async (account_number: number) => {
	return await supabase
		.from("manager")
		.update({ is_deleted: true })
		.eq("account_number", account_number)
		.select();
};

// manager_bank

// CREATE manager bank
const createBankDetails = async (bankData: any) => {
	return await supabase
		.from("manager_bank")
		.insert([bankData])
		.select();
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
		.select();
};

// DELETE bank (soft Delete)
const deleteBankDetails = async (bank_number: number) => {
	return await supabase
		.from("manager_bank")
		.update({ is_deleted: true })
		.eq("bank_number", bank_number)
		.select();
};

// CREATE manager_payment
const addPaymentDetails = async (paymentData: any) => {
	const { transaction_id } = paymentData;

	const { data: res, error } = await supabase
		.from("manager_payment_details")
		.insert([paymentData])
		.select();

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
		.select(`*, manager!inner(*), bill!inner(*)`)
		.eq("is_deleted", false);
};

// UPDATE payments
const updatePaymentDetails = async (id: number, updates: any) => {
	return await supabase
		.from("manager_payment_details")
		.update(updates)
		.eq("id", id)
		.select();
};

// DELETE payments
const deletePaymentDetails = async (id: number) => {
	return await supabase
		.from("manager_payment_details")
		.update({ is_deleted: true })
		.eq("id", id)
		.select();
};

const countAllManager = async (): Promise<number | null> => {
	const { count, error } = await supabase
		.from("manager")
		.select("*", { count: "exact", head: true });

	if (error) throw new Error(error.message);

	return count;
};

// List of approved applicants that have no room assigned yet
// Involves: user, student, application, manager
async function getUnassignedApprovedApplicants(managerAccountNumber: number) {
	const { data, error } = await supabase
		.from("application")
		.select(
			`
      application_id,
      application_status,
      expected_moveout_date,
      actual_moveout_date,
      housing_name,
      preferred_room_type,
      room_id
      manager!inner (
        account_number,
        student!inner (
          account_number,
          student_number,
          user!inner (
            first_name,
            middle_name,
            last_name,
            account_email
          )
        ),
      )
    `,
		)
		.eq("application_status", "Approved")
		.is("room_id", null) // unassigned — no room yet
		.eq("manager_account_number", managerAccountNumber)
		.eq("is_deleted", false);

	if (error) {
		console.error(
			"Error fetching unassigned approved applicants:",
			error.message,
		);
		return { data: null, error };
	}

	return { data, error: null };
}

// Total rooms managed by a housing admin
// Involves: manager, housing, room
async function getTotalRoomsManaged(managerAccountNumber: number) {
	const { data, error } = await supabase
		.from("housing")
		.select(
			`
      housing_id,
      housing_name,
      housing_address,
      housing_type,
      rent_price,
      room!inner (
        room_id,
        room_type,
        occupancy_status,
        payment_status,
        maximum_occupants
      )
    `,
		)
		.eq("manager_account_number", managerAccountNumber)
		.eq("is_deleted", false);

	if (error) {
		console.error("Error fetching total rooms by manager:", error.message);
		return { data: null, error, totalRooms: 0 };
	}

	// Count total rooms across all housings
	const totalRooms =
		data?.reduce((acc, housing) => {
			return acc + (housing.room?.length ?? 0);
		}, 0) ?? 0;

	return { data, totalRooms, error: null };
}

// Total tenants managed by a manager
// Involves: manager, housing, room, student_accommodation_history
async function getTotalTenantsManaged(managerAccountNumber: number) {
	const { data, error } = await supabase
		.from("housing")
		.select(
			`
      housing_id,
      housing_name,
      room!inner (
        room_id,
        room_type,
        occupancy_status,
        maximum_occupants,
        student_accommodation_history!inner (
          account_number,
          movein_date,
          moveout_date
        )
      )
    `,
		)
		.eq("manager_account_number", managerAccountNumber)
		.eq("is_deleted", false);

	if (error) {
		console.error(
			"Error fetching total tenants by manager:",
			error.message,
		);
		return { data: null, error, totalTenants: 0 };
	}

	// Count total tenants across all rooms
	const totalTenants =
		data?.reduce((acc, housing) => {
			const tenantsInHousing =
				housing.room?.reduce((roomAcc: number, room: any) => {
					return (
						roomAcc +
						(room.student_accommodation_history?.length ?? 0)
					);
				}, 0) ?? 0;
			return acc + tenantsInHousing;
		}, 0) ?? 0;

	return { data, totalTenants, error: null };
}

// Overall occupancy rate of managed dorms
// Involves: manager, housing, room, student_accommodation_history
// Returns a ratio: total current tenants / total maximum occupants
async function getOverallOccupancyRate(managerAccountNumber: number) {
	const { data, error } = await supabase
		.from("housing")
		.select(
			`
      housing_id,
      housing_name,
      room!inner (
        room_id,
        maximum_occupants,
        occupancy_status,
        student_accommodation_history!inner (
          account_number,
          movein_date,
          moveout_date
        )
      )
    `,
		)
		.eq("manager_account_number", managerAccountNumber)
		.eq("is_deleted", false);

	if (error) {
		console.error("Error fetching occupancy rate:", error.message);
		return {
			data: null,
			error,
			totalOccupants: 0,
			totalMaxOccupants: 0,
			occupancyRate: "0%",
		};
	}

	let totalOccupants = 0;
	let totalMaxOccupants = 0;

	data?.forEach((housing) => {
		housing.room?.forEach((room: any) => {
			totalMaxOccupants += room.maximum_occupants ?? 0;
			totalOccupants += room.student_accommodation_history?.length ?? 0;
		});
	});

	// Compute occupancy rate as a percentage
	const occupancyRate =
		totalMaxOccupants > 0
			? `${((totalOccupants / totalMaxOccupants) * 100).toFixed(1)}%`
			: "0%";

	return {
		data,
		totalOccupants,
		totalMaxOccupants,
		occupancyRate, // e.g. "75.0%"
		error: null,
	};
}

const getManagedHousings = async (managerAccountNumber: number) => {
	const { data: manager, error: managerError } = await supabase
		.from("manager")
		.select("account_number, manager_type")
		.eq("account_number", managerAccountNumber)
		.single();

	if (managerError || !manager) throw new Error("Unauthorized");

	const { data, error } = await supabase
		.from("housing")
		.select(
			`
      housing_id,
      housing_name,

      room!inner(
        room_id,
        room_type,
        maximum_occupants,

        student_accommodation_history!inner(
          movein_date,
          moveout_date,

          student_academic!inner(
            account_number,
            degree_program,
            standing,
            status
          )
        )
      )
    `,
		)
		.eq("manager_account_number", managerAccountNumber)
		.eq("is_deleted", false);

	if (error) throw error;

	return data;
};

const getAllTenants = async (managerAccountNumber: number) => {
	const { data: manager, error: managerError } = await supabase
		.from("manager")
		.select("account_number, manager_type")
		.eq("account_number", managerAccountNumber)
		.eq("manager_type", "landlord");

	if (managerError || !manager)
		throw new Error("Unauthorized: Landlord access only");

	const { data, error } = await supabase
		.from("student_accommodation_history")
		.select(
			`
      move_in_date,
      expected_move_out_date,

      student_academic!inner(
        account_number,
        degree_program,
        standing,
        status
      ),

      room!inner(
        room_id,
        room_type,
        housing!inner(
          housing_name
        )
      )
    `,
		)
		.eq("is_deleted", false);

	if (error) throw error;

	return data;
};

const getStudentBalance = async (student_account_number: number) => {
	const { data, error } = await supabase
		.from("bill")
		.select(
			`
      transaction_id,
      amount, 
      status,
      student!inner (
        user!inner(
          first_name,
          last_name,
          manager!inner(
            *
          )
        )
      )
    `,
		)
		.eq("student_account_number", student_account_number)
		.eq("is_deleted", false)
		.in("status", ["Pending", "Overdue"]);

	if (error) throw error;

	const total = data?.reduce((sum, bill) => {
		return sum + Number(bill.amount);
	}, 0);

	return {
		student: data?.[0]?.student || null,
		totalBalance: total ?? 0,
		bills: data,
	};
};

const getAllBillings = async () => {
	const { data, error } = await supabase
		.from("bill")
		.select(
			`
      transaction_id,
      amount,
      status,
      due_date,
      student!inner (
        account_number,
        user!inner(
          first_name,
          last_name,
          account_email,
            student_accommodation_history!inner(
            room!inner (
              room_id,
              housing!inner (
                housing_name,
                manager!inner (
                  account_number,
                  manager_type
                )
              )
            )
          )
        ),
      )
    `,
		)
		.eq("is_deleted", false)
		.order("due_date", { ascending: false });

	if (error) throw error;

	return data;
};

export const managerData = {
	create,
	getAll,
	findById,
	update,
	findManagerProfileById,
	deactivate,
	createBankDetails,
	countAllManager,
	getBanks,
	updateBankDetails,
	deleteBankDetails,
	addPaymentDetails,
	getPaymentDetails,
	updatePaymentDetails,
	deletePaymentDetails,
	getUnassignedApprovedApplicants,
	getTotalRoomsManaged,
	getTotalTenantsManaged,
	getOverallOccupancyRate,
	getManagedHousings,
	getAllTenants,
	getStudentBalance,
	getAllBillings,
};
