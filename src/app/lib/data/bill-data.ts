import { supabase } from "../supabase";
import type { Bill, NewBill, UpdateBill } from "@/lib/models/bill"

const create = async (billData: Bill) => {
	return await supabase.from("bill").insert([billData]).select().single();
};

const getAll = async () => {
	return await supabase
		.from("bill")
		.select("*, manager(*), student(*)")
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
	getTotalBalance
};
