import { auditLogData } from "../data/audit-log-data";
import { AuditLog, NewAuditLog, Role } from "@/models/audit_log";

const getAllAuditLogs = async (role?: Role, account_number?: number): Promise<AuditLog[]> => {
    try {
        const auditLogs = await auditLogData.getAll(role, account_number);
        return auditLogs ?? [];
    } catch (error) {
        console.error("Error:", error);
        throw new Error("Failed to fetch audit logs.");
    }
};

const createAuditLog = async (auditLog: NewAuditLog): Promise<void> => {
    try {
        // Create Audit Log 
        const auditlog = await auditLogData.create({
            action_type: auditLog.action_type,
            audit_description: auditLog.audit_description,
            user_name: auditLog.user_name || null,
            partial_ip: auditLog.partial_ip,
            account_number: auditLog.account_number || null,
            assigned_manager: auditLog.assigned_manager || null,
            timestamp: auditLog.timestamp
        });

        if (!auditlog) {
            throw new Error("Failed to create audit log");
        }

    } catch (error) {
        console.error("Error creating audit log:", error);
        throw new Error("Failed to create audit log");
    }
};

export const auditLogService = {
    getAllAuditLogs,
    createAuditLog
}

export const randomIpAddress = () => {
    const first = Math.floor(Math.random() * 256);
    const second = Math.floor(Math.random() * 256);
    return `${first}.${second}.x.x`;
};