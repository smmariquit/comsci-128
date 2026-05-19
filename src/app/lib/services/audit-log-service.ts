import { headers } from "next/headers";
import { auditLogData } from "../data/audit-log-data";
import { AuditLog, Role, ActionType, NewAuditLog } from "../models/audit_log";

// Helper function to securely mask IP addresses (e.g. 192.168.1.100 -> 192.168.x.x)
function maskIp(ip: string | null): string {
  if (!ip) return "Unknown";
  // IPv4 masking
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.x.x`;
    }
  }
  // IPv6 masking
  if (ip.includes(":")) {
    const parts = ip.split(":");
    if (parts.length > 4) {
      return `${parts[0]}:${parts[1]}:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx`;
    }
  }
  return "Unknown";
}

export async function createAuditLog(
  account_number: number,
  user_name: string,
  action_type: ActionType,
  audit_description: string,
  assigned_manager: number | null = null,
) {
  try {
    const headersList = await headers();
    const rawIp =
      headersList.get("x-forwarded-for") ||
      headersList.get("x-real-ip") ||
      null;

    // Properly mask the IP before it ever hits the database
    const partial_ip = maskIp(rawIp?.split(",")[0].trim() ?? null);

    const newLog: NewAuditLog = {
      account_number,
      user_name,
      action_type,
      audit_description,
      partial_ip,
      assigned_manager,
    };

    await auditLogData.create(newLog);
  } catch (error) {
    // We don't throw here to avoid breaking main application flow if logging fails
    console.error("Failed to create audit log:", error);
  }
}

async function getAuditLogs(
  userId: string,
  role: Role,
  account_number: number,
): Promise<AuditLog[]> {
  try {
    if (!userId) {
      throw new Error("User must be authenticated");
    }
    const auditLogs = await auditLogData.getAll(role, account_number);
    if (!auditLogs) return [];
    return auditLogs;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to fetch audit logs.");
  }
}

async function getRecentLogs(): Promise<AuditLog[]> {
  try {
    const recentLogs = await auditLogData.getRecent();
    if (!recentLogs || recentLogs.length === 0) {
      return [];
    }
    return recentLogs;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to fetch recent audit logs.");
  }
}

async function getRecentLogsByManager(managerAccountNumber: number) {
  try {
    const recentLogs =
      await auditLogData.getRecentByManager(managerAccountNumber);

    if (!recentLogs || recentLogs.length === 0) {
      return [];
    }

    return recentLogs;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to fetch recent audit logs.");
  }
}

export const auditLogService = {
  getAuditLogs,
  getRecentLogs,
  createAuditLog,
  getRecentLogsByManager,
};
