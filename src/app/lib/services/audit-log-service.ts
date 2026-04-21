import { auditLogData, Role } from "../data/audit-log-data";
import { AuditLog } from "../models/audit_log";

async function getAuditLogs(userId: string, role: Role, account_number: number): Promise<AuditLog[]> {
    try {
        // Authorization check
        if (!userId) {
            throw new Error("User must be authenticated");
        }

        // Fetch audit logs filtered by role:
        // - System Admin: sees all logs
        // - Manager: sees logs for their assigned students
        // - Student: sees only their own logs
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

export const auditLogService = {
    getAuditLogs,
    getRecentLogs
}