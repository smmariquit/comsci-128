import { supabase } from '@/app/lib/supabase';

export type ActionType = 'Application Status' | 'Bill Status' | 'Auth Register' | 'Auth Logic' | 'Change Auth Password' | 'Delete Account'
| 'Update User Role' | 'Submit Application' | 'Update Application Status' | 'Withdraw Application' | 'Create Housing' | 'Update Housing' |
'Assign Student Housing' | 'Assign Bill' | 'Update Bill Status' | 'Issue Bill Refund'

export interface AuditLog{
    audit_id?: number
    timestamp: string
    action_type: ActionType
    audit_description: string
    user_id: number
    user_name: string
    account_number: number
}

// CREATE AUDIT LOG
async function createAuditLog(audit_log: AuditLog) {
    const { data, error } = await supabase.from('audit_log').insert([audit_log]).select();
    if (error) throw error
    return data
} 

// READ ALL AUDIT LOGS
async function getAllAuditLogs(){
    const { data, error } = await supabase.from('audit_log').select('*');
    if (error) throw error
    return data
}

// READ AUDIT LOGS BASED ON ACCOUNT NUMBER
async function getAuditLogByAccountNumber(account_number: number){
    const { data, error } = await supabase.from('audit_log').select('*').eq('account_number', account_number);
    if (error) throw error
    return data
}

// UPDATE AUDIT LOGS
async function updateAuditLog(audit_id: number, updatedFields: Partial<AuditLog>){
    const { data, error } = await supabase.from('audit_log').update(updatedFields).eq('audit_id', audit_id).select();
    if (error) throw error
    return data
}

export const auditLogData = {
	createAuditLog,
	getAllAuditLogs,
	getAuditLogByAccountNumber,
	updateAuditLog
}