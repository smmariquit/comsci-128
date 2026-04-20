import { auditLogService } from "@/app/lib/services/audit-log-service";
import { NextRequest, NextResponse } from "next/server";

// Fetch all audit logs for system admin
export async function GET(request: NextRequest) {
    try {
        /*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */

        // filler for system admin
        
        // Authorization check
        // if (!user) {
        //     return NextResponse.json(
        //         { message: "Unauthorized" },
        //         { status: 401 },
        //     );
        // }

        // Filler for system admin (temporary for testing)
        const auditLogs = await auditLogService.getAuditLogs(
            "174",
            "Landlord",
            174
        );

        // Send Response
        if (!auditLogs || auditLogs.length === 0) {
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