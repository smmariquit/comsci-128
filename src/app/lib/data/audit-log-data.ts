import { supabase } from "@/app/lib/supabase";
import { AuditLog } from "@/models/audit_log"

export type Role = 'Student' | 'Housing_Admin' | 'Landlord' | 'System_Admin'

export type ActionType = 'Application Status' | 'Bill Status' | 'Auth Register' | 'Auth Logic' | 'Change Auth Password' | 'Delete Account'
| 'Update User Role' | 'Submit Application' | 'Update Application Status' | 'Withdraw Application' | 'Create Housing' | 'Update Housing' |
'Assign Student Housing' | 'Assign Bill' | 'Update Bill Status' | 'Issue Bill Refund'

/*
	TO DO: Insert in other services based on different action type
	Remaining:
	'Application Status' | 'Bill Status' | 'Auth Register' | 'Auth Logic' | 'Change Auth Password' | 'Delete Account'
| 	'Update User Role' | 'Submit Application' | 'Update Application Status' | 'Withdraw Application' | 'Create Housing' | 'Update Housing' |
	'Assign Student Housing' | 'Assign Bill' | 'Update Bill Status' | 'Issue Bill Refund'

*/

async function create(audit_log: AuditLog) {
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
	} else if (role === "Housing_Admin" || role === "Landlord"){
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
