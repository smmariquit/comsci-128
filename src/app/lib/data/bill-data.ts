import { BillRow } from "@/app/components/admin/billings/billingtable";
import { PaymentStatus } from "@/app/components/admin/reports/reportsmock";
import { supabase } from "@/app/lib/supabase";

export type ActionType = "Application Status" | "Bill Status";

export interface AuditLog {
	audit_id?: number;
	timestamp: string;
	action_type: ActionType;
	audit_description: string;
	user_id: number;
	user_name: string;
	account_number: number;
}

// CREATE AUDIT LOG
export async function createAuditLog(audit_log: AuditLog) {
	const { data, error } = await supabase
		.from("audit_log")
		.insert([audit_log])
		.select();
	if (error) throw error;
	return data;
}

// READ ALL AUDIT LOGS
export async function getAllAuditLogs() {
	const { data, error } = await supabase.from("audit_log").select("*");
	if (error) throw error;
	return data;
}

// READ AUDIT LOGS BASED ON ACCOUNT NUMBER
export async function getAuditLogByAccountNumber(account_number: number) {
	const { data, error } = await supabase
		.from("audit_log")
		.select("*")
		.eq("account_number", account_number);
	if (error) throw error;
	return data;
}

// UPDATE AUDIT LOGS
export async function updateAuditLog(
	audit_id: number,
	updatedFields: Partial<AuditLog>,
) {
	const { data, error } = await supabase
		.from("audit_log")
		.update(updatedFields)
		.eq("audit_id", audit_id)
		.select();
	if (error) throw error;
	return data;
}

// FIND ALL BILLINGS
async function findAllBillings(): Promise<BillRow[]> {
	const { data, error } = await supabase
	.from("bill")
	.select(`
		transaction_id,
		amount,
		status,
		bill_type,
		due_date,
		issue_date,
		date_paid,
		student_account_number
	`)
	.eq("is_deleted", false);

	if (error) throw new Error(error.message);

	return (data || []).map((b: any) => {
		return {
			transaction_id: b.transaction_id,
			student_name: `${b.student?.user?.first_name} ${b.student?.user?.last_name}`,
			student_account_number: b.student_account_number,
			housing_name: "Unassigned",
			bill_type: b.bill_type,
			amount: Number(b.amount),
			status: b.Status as PaymentStatus,
			due_date: b.due_date,
			issue_date: b.issue_date,
			date_paid: b.date_paid,
		};
	});
}

// UPDATE BILLING STATUS
async function updateBilling(txnId: number, status: PaymentStatus, datePaid?: String) {
	const payload: any = {status};
	if (datePaid) payload.date_paid = datePaid;

	const { data, error } = await supabase
		.from("bill")
		.update(payload)
		.eq("transaction_id", txnId)
		.select()
		.single();

	if (error) throw new Error(error.message);
}

// DELETE BILLING
async function deleteBilling(txnId: number) {
	const { error } = await supabase
		.from("bill")
		.update({ is_deleted: true })
		.eq("transaction_id", txnId);

	if (error) throw new Error(error.message)
} 

export const billingData = {
	findAllBillings,
	updateBilling,
	deleteBilling
}
