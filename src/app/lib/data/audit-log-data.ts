import { supabase } from '@/app/lib/supabase';
import { AuditLog, NewAuditLog, Role, ActionType } from "@/app/lib/models/audit_log"

// CREATE AUDIT LOG
async function create(audit_log: NewAuditLog) {
	const { data, error } = await supabase
		.from("audit_log")
		.insert([audit_log])
		.select();
	if (error) throw error;
	return data;
}

async function getAll(role: Role, account_number: number) {

	// system admin sees all audit logs
	let query = supabase.from("audit_log").select("*"); 

	if(role === "Student"){
		query = query.eq("account_number", account_number);
	} else if (role === "Manager"){
		query = query.or(`account_number.eq.${account_number}, assigned_manager.eq.${account_number}`);
	}

	const { data, error } = await query;
	if (error) throw error;
	return data;
}


async function getRecent() {
	const { data, error } = await supabase
		.from("audit_log")
        .select("*")
        .order("timestamp", { ascending: false })  // Most recent first
        .limit(5);
	if (error) throw error;
	return data;
}

// READ AUDIT LOGS BASED ON ACCOUNT NUMBER
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
	getByAccountNumber,
	getRecent
}
