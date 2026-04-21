import { auditLogService } from "@/app/lib/services/audit-log-service";
import { NextRequest, NextResponse } from "next/server";

// Fetch all audit logs for system admin
export async function GET() {
    try {
        /*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */

        const auditLogs = await auditLogService.getAllAuditLogs();

        // Send Response
        if (!auditLogs) {
            // User not found
            return NextResponse.json(
                { message: "Audit logs not found." },
                { status: 404 },
            );
        }

        // Success
        return NextResponse.json(auditLogs, { status: 200 });
        
    } catch (error: any) {
        console.error("Error fetching audit logs:", error);
        return NextResponse.json(
            { message: "Failed to fetch audit logs.", error: error.message },
            { status: 500 },
        );
    }
}
