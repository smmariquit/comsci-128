import { auditLogData } from "../data/audit-log-data";
import { AuditLog, Role } from "@/models/audit_log";

const getAllAuditLogs = async (role?: Role, account_number?: number): Promise<AuditLog[]> => {
    try {
        const auditLogs = await auditLogData.getAll(role, account_number);
        return auditLogs ?? [];
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to fetch audit logs.");
    }
};

export const auditLogService = {
    getAllAuditLogs
}