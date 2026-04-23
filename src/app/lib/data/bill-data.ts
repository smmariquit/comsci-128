import { supabase } from "../supabase";

const create = async (billData: any) => {
	return await supabase.from("bill").insert([billData]).select().single();
};

const getAll = async () => {
	return await supabase
		.from("bill")
		.select(`
            *,
            student (
                user ( first_name, last_name ),
                application (
                    room (
                        housing ( housing_name )
                    )
                )
            )
        `)
		.eq("is_deleted", false);
};

const getById = async (transaction_id: number) => {
	return await supabase
		.from("bill")
		.select("*, manager(*), student(*)")
		.eq("transaction_id", transaction_id)
		.eq("is_deleted", false)
		.single();
};

const update = async (transaction_id: number, updates: any) => {
	return await supabase
		.from("bill")
		.update(updates)
		.eq("transaction_id", transaction_id)
		.select()
		.single();
};

const markAsPaid = async (transaction_id: number) => {
	return await supabase
		.from("bill")
		.update({
			status: "Paid",
			date_paid: new Date().toISOString(),
		})
		.eq("transaction_id", transaction_id)
		.select()
		.single();
};

// delete bill
const remove = async (transaction_id: number) => {
	return await supabase
		.from("bill")
		.update({ is_deleted: true })
		.eq("transaction_id", transaction_id);
};

// GET bills by manager
const getBillsOfManager = async (account_number: number) => {
	return await supabase
		.from("bill")
		.select("*, student(*)")
		.eq("manager_account_number", account_number)
		.eq("is_deleted", false);
};

// GET bills per student
const getBillsOfStudent = async (account_number: number) => {
	return await supabase
		.from("bill")
		.select("*, manager(*)")
		.eq("student_account_number", account_number)
		.eq("is_deleted", false);
};

// GET bills based on their payment status
const getBillsByStatus = async (status: string) => {
	return await supabase
		.from("bill")
		.select("*, manager(*), student(*)")
		.eq("status", status)
		.eq("is_deleted", false);
};

// gets overdue bills
const getOverdueBills = async () => {
	const today = new Date().toISOString();

	return await supabase
		.from("bill")
		.select("*, manager(*), student(*)")
		.lt("due_date", today)
		.eq("status", "Pending")
		.eq("is_deleted", false);
};

// total balance per student
const getTotalBalance = async (account_number: number) => {
	const { data, error } = await supabase
		.from("bill")
		.select("amount, status")
		.eq("student_account_number", account_number)
		.eq("is_deleted", false);

	const total = data?.reduce((sum: number, bill: any) => {
		if (bill.status == "Pending") {
			return sum + Number(bill.amount);
		} else {
			return sum;
		}
	}, 0);
	return total ?? 0;
};

const getBillsOfLandlord = async (managedHousingIds: number[] = []) => {
	return await supabase
		.from("bill")
		.select(`
            *,
            student (
                user ( first_name, last_name ),
                student_accommodation_history (
					room!inner (
						housing!inner ( 
							housing_id, housing_name 
						)
					)
				)
            )
        `)
		.eq("is_deleted", false)
};

export const billData = {
	create,
	getAll,
	getById,
	update,
	markAsPaid,
	remove,
	getBillsOfManager,
	getBillsOfStudent,
	getBillsByStatus,
	getOverdueBills,
	getTotalBalance,
	getBillsOfLandlord,
};
