<<<<<<< HEAD
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
=======
import { supabase } from '@/app/lib/supabase';
import { AuditLog, NewAuditLog, Role, ActionType } from "@/app/lib/models/audit_log"

// CREATE AUDIT LOG
async function create(audit_log: NewAuditLog) {
>>>>>>> 28abcf0e34af61c37f9cb8e87d05188697d701ea
	const { data, error } = await supabase
		.from("audit_log")
		.insert([audit_log])
		.select();
	if (error) throw error;
	return data;
}

<<<<<<< HEAD
async function getAll(role: Role, account_number: number) {

	// system admin sees all audit logs
	let query = supabase.from("audit_log").select("*"); 

	if(role === "Student"){
		query = query.eq("account_number", account_number);
	} else if (role === "Housing_Admin" || role === "Landlord"){
=======
// READ ALL AUDIT LOGS
async function getAll(role?: Role, account_number?: number) {
	// system admin sees all audit logs
	let query = supabase.from("audit_log").select("*");

	if (role === "Student") {
		query = query.eq("account_number", account_number);
	} else if (role === "Manager") {
>>>>>>> 28abcf0e34af61c37f9cb8e87d05188697d701ea
		query = query.or(`account_number.eq.${account_number}, assigned_manager.eq.${account_number}`);
	}

	const { data, error } = await query;
<<<<<<< HEAD
	if (error) throw error;
	return data;
}


async function getRecent() {
	const { data, error } = await supabase
		.from("audit_log")
        .select("*")
        .order("timestamp", { ascending: false })  // Most recent first
        .limit(5);
=======

>>>>>>> 28abcf0e34af61c37f9cb8e87d05188697d701ea
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
<<<<<<< HEAD
=======
}

// UPDATE AUDIT LOGS
async function update(audit_id: number, updatedFields: Partial<AuditLog>) {
	const { data, error } = await supabase.from('audit_log').update(updatedFields).eq('audit_id', audit_id).select();
	if (error) throw error
	return data
>>>>>>> 28abcf0e34af61c37f9cb8e87d05188697d701ea
}

export const auditLogData = {
	create,
	getAll,
	getByAccountNumber,
	getRecent
}
