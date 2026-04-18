import { supabase } from "@/app/lib/supabase";
import { AuditLog } from "@/models/audit_log"

async function create(audit_log: AuditLog) {
	const { data, error } = await supabase
		.from("audit_log")
		.insert([audit_log])
		.select();
	if (error) throw error;
	return data;
}

async function getAll() {
	const { data, error } = await supabase.from("audit_log").select("*");
	if (error) throw error;
	return data;
}

async function getByAccountNumber(account_number: number) {
	const { data, error } = await supabase
		.from("audit_log")
		.select("*")
		.eq("account_number", account_number);
	if (error) throw error;
	return data;
}

export const auditLogData = {
	create,
	getAll,
	getByAccountNumber
}
