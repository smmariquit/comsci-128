import { AuditLog, auditLogData } from "../data/audit-log-data";

const getAllAuditLogs = async (): Promise<AuditLog[]> => {
    try {
        const auditLogs = await auditLogData.getAll();
        return auditLogs ?? [];
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to fetch audit logs.");
    }
};