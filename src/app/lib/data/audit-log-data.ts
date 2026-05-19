import { supabaseAdmin as supabase } from "@/app/lib/supabase-admin";
import {
  AuditLog,
  NewAuditLog,
  Role,
  ActionType,
} from "@/app/lib/models/audit_log";

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
  console.log("getAll called with role:", role, "account_number:", account_number);
  
  let query = supabase.from("audit_log").select("*");

  if (role === "Student") {
    console.log("Filtering as Student for account:", account_number);
    query = query.eq("account_number", account_number);
  } else if (role === "Manager") {
    console.log("Filtering as Manager for account:", account_number);
    query = query.or(
      `account_number.eq.${account_number},assigned_manager.eq.${account_number}`
    );
  } else {
    console.log("System admin - no filter");
  }

  const { data, error } = await query;
  
  console.log("Query error:", error);
  console.log("Query returned:", data?.length, "records");
  if (data && data.length > 0) {
    console.log("First record:", data[0]);
  }
  
  if (error) throw error;
  return data;
}

async function getRecent() {
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .order("timestamp", { ascending: false }) // Most recent first
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

async function getRecentByManager(managerAccountNumber: number) {
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .or(
      `account_number.eq.${managerAccountNumber},assigned_manager.eq.${managerAccountNumber}`
    )
    .order("timestamp", { ascending: false })
    .limit(5);
  if (error) throw error;
  return data;
}

export const auditLogData = {
  create,
  getAll,
  getByAccountNumber,
  getRecent,
  getRecentByManager,
};
