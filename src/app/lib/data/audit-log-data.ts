import { supabase } from '@/app/lib/supabase';
import { AuditLog, NewAuditLog, Role, ActionType } from "@/app/lib/models/audit_log";

// CREATE AUDIT LOG
async function create(audit_log: NewAuditLog) {
	const { data, error } = await supabase
		.from("audit_log")
		.insert([audit_log])
		.select();
	if (error) throw error;
	return data;
}

async function getAll(role: Role, account_number: number, page = 1) {
	const totalPageRows = 5;
	const from = (page - 1) * totalPageRows;
	const to = from + totalPageRows - 1;

	// system admin sees all audit logs
	let query = supabase
		.from("audit_log")
		.select("*", { count: "exact" })
		.order("timestamp", { ascending: false }) // Most recent first
		.range(from, to); 

	if(role === "Student"){
		query = query.eq("account_number", account_number);
	} else if (role === "Manager"){
		query = query.or(`account_number.eq.${account_number}, assigned_manager.eq.${account_number}`);
	}

	const { data, count, error } = await query;
	if (error) throw error;

	const totalPages = Math.ceil(count / totalPageRows);
	return {
		data, totalPages, currentPage: page
	};
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
async function getByAccountNumber(account_number: number, page = 1) {
	const totalPageRows = 5;
	const from = (page - 1) * totalPageRows;
	const to = from + totalPageRows - 1;

	const { data, count, error } = await supabase
		.from("audit_log")
		.select("*", { count: "exact" })
		.eq("account_number", account_number)
		.order("timestamp", { ascending: false })
		.range(from, to);

	if (error) throw error;
	const totalPages = Math.ceil(count / totalPageRows);
	return {
		data, totalPages, currentPage: page
	};
}

async function getRecentByManager(managerAccountNumber: number) {
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .eq("assigned_manager", managerAccountNumber)
    .order("timestamp", { ascending: false }) // Most recent first
    .limit(5);
  if (error) throw error;
  return data;
}

export const auditLogData = {
	create,
	getAll,
	getByAccountNumber,
	getRecent,
	getRecentByManager
}
