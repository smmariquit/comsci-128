import { supabase } from "../supabase";
import type { Bill, NewBill, UpdateBill } from "@/lib/models/bill"

type BillingHistoryFilters = {
  status?: "Unpaid" | "Overdue";
  sortBy?: "due_date" | "amount";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

const create = async (billData: Bill) => {
	return await supabase.from("bill").insert([billData]).select().single();
};

// TODO: TO FIX ALL INNER JOINS
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

const getBillingHistory = async (filters: BillingHistoryFilters = {}) => {
	const today = new Date().toISOString();
	let query = supabase
		.from("bill")
		.select(`
            *,
            student (
                user ( first_name, last_name )
            )
        `)
		.eq("is_deleted", false);

	if (filters.status === "Unpaid") {
		query = query.eq("status", "Pending");
	} else if (filters.status === "Overdue") {
		query = query.eq("status", "Pending").lt("due_date", today);
	}

	const ascending = filters.sortOrder !== "desc";

	if (filters.sortBy === "amount") {
		query = query.order("amount", { ascending }).order("due_date", { ascending });
	} else {
		query = query.order("due_date", { ascending }).order("amount", { ascending });
	}

	if (filters.page && filters.pageSize) {
		const from = (filters.page - 1) * filters.pageSize;
		const to = from + filters.pageSize - 1;
		query = query.range(from, to);
	}

	return await query;
};

const getById = async (transactionId: number) => {
	return await supabase
		.from("bill")
		.select("*, manager!inner(*), student!inner(*)")
		.eq("transaction_id", transactionId)
		.eq("is_deleted", false)
		.single();
};

const update = async (transactionId: number, updates: Bill) => {
	return await supabase
		.from("bill")
		.update(updates)
		.eq("transaction_id", transactionId)
		.select()
		.single();
};

const markAsPaid = async (transactionId: number) => {
	return await supabase
		.from("bill")
		.update({
			status: "Paid",
			date_paid: new Date().toISOString(),
		})
		.eq("transaction_id", transactionId)
		.select()
		.single();
};

// delete bill
const remove = async (transactionId: number) => {
	return await supabase
		.from("bill")
		.update({ is_deleted: true })
		.eq("transaction_id", transactionId);
};

// GET bills by manager
const getBillsOfManager = async (accountNumber: number) => {
	return await supabase
		.from("bill")
		.select("*, student!inner(*)")
		.eq("manager_account_number", accountNumber)
		.eq("is_deleted", false);
};

// GET bills per student
const getBillsOfStudent = async (accountNumber: number) => {
	return await supabase
		.from("bill")
		.select("*, manager!inner(*)")
		.eq("student_account_number", accountNumber)
		.eq("is_deleted", false);
};

// GET bills based on their payment status
const getBillsByStatus = async (status: string) => {
	return await supabase
		.from("bill")
		.select("*, manager!inner(*), student!inner(*)")
		.eq("status", status)
		.eq("is_deleted", false);
};

// gets overdue bills
const getOverdueBills = async () => {
	const today = new Date().toISOString();

	return await supabase
		.from("bill")
		.select("*, manager!inner(*), student!inner(*)")
		.lt("due_date", today)
		.eq("status", "Pending")
		.eq("is_deleted", false);
};

// total balance per student
const getTotalBalance = async (accountNumber: number) => {
	const { data, error } = await supabase
		.from("bill")
		.select("amount, status")
		.eq("student_account_number", accountNumber)
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

//gets gross Revenue
const getGrossRevenue = async (managerAccountNumber?: number): Promise<number> => {

  let query = supabase
    .from("bill")
    .select("amount")
    .eq("status", "Paid")
    .eq("is_deleted", false);

  if (managerAccountNumber) {
    query = query.eq("manager_account_number", managerAccountNumber);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data?.reduce((sum: number, bill: any) => sum + Number(bill.amount), 0) ?? 0;
}

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
	getBillingHistory,
	getTotalBalance,
	getGrossRevenue,
	getBillsOfLandlord
};
