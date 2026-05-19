import { auditLogService } from "@/app/lib/services/audit-log-service";
import type { Role } from "@/app/lib/models/audit_log";
import { createSupabaseServerClient } from "@/app/lib/server-client";
import { getCurrentUserRole } from "@/app/lib/services/authorization-service";
import { NextRequest, NextResponse } from "next/server";

function toAuditRole(
  role: Awaited<ReturnType<typeof getCurrentUserRole>>,
): Role {
  if (role === "student") return "Student";
  if (role === "system_admin") return "System Admin";
  return "Manager";
}

// Fetch 5 recent audit logs for the current authenticated user
export async function GET(request: NextRequest) {
  try {
    // Authentication
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

    // Role-based access
    const role = await getCurrentUserRole();
    const auditLogs = await auditLogService.getRecentLogs();

    // Filter based on role (same logic as main endpoint)
    let filtered = auditLogs;
    if (role === "student") {
      filtered = auditLogs.filter(
        (log) => log.account_number === accountNumber,
      );
    } else if (role === "housing_admin" || role === "landlord") {
      filtered = auditLogs.filter(
        (log) =>
          log.account_number === accountNumber ||
          log.assigned_manager === accountNumber,
      );
    }
    // system_admin sees all

    // Send Response
    if (!filtered || filtered.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Success
    return NextResponse.json(filtered, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching audit logs:", error);
    return NextResponse.json(
      { message: "Failed to fetch audit logs.", error: error.message },
      { status: 500 },
    );
  }
}
