import { NextResponse } from "next/server";
import type { Role } from "@/app/lib/models/audit_log";
import { createSupabaseServerClient } from "@/app/lib/server-client";
import { auditLogService } from "@/app/lib/services/audit-log-service";
import { getCurrentUserRole } from "@/app/lib/services/authorization-service";

function toAuditRole(
  role: Awaited<ReturnType<typeof getCurrentUserRole>>,
): Role {
  if (role === "student") return "Student";
  if (role === "system_admin") return "System Admin";
  return "Manager";
}

// Fetch audit logs for the current authenticated user
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const accountNumber = Number(user.user_metadata?.account_number ?? 0);
    if (!accountNumber) {
      return NextResponse.json(
        { message: "Account number is missing from the session." },
        { status: 400 },
      );
    }

    const role = await getCurrentUserRole();
    const auditLogs = await auditLogService.getAuditLogs(
      user.id,
      toAuditRole(role),
      accountNumber,
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
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { message: "Failed to fetch audit logs.", error: message },
      { status: 500 },
    );
  }
}
