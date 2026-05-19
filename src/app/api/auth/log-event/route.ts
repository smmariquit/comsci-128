import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/server-client";
import { createAuditLog } from "@/app/lib/services/audit-log-service";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { action, description } = await request.json().catch(() => ({}));
    if (!action || !description) {
      return NextResponse.json(
        { message: "Missing action or description" },
        { status: 400 },
      );
    }

    const accountNumber = Number(user.user_metadata?.account_number ?? 0);
    if (!accountNumber) {
      return NextResponse.json(
        { message: "Account number is missing from session metadata" },
        { status: 400 },
      );
    }

    // Fetch user profile from database to get the real name
    const { data: dbUser } = await supabase
      .from("user")
      .select("first_name, last_name")
      .eq("account_number", accountNumber)
      .single();

    const userName = dbUser
      ? `${dbUser.first_name} ${dbUser.last_name}`.trim()
      : user.user_metadata?.full_name || user.email || "Unknown User";

    await createAuditLog(
      accountNumber,
      userName,
      action,
      description
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error creating login log:", error);
    return NextResponse.json(
      { message: "Failed to record log event", error: message },
      { status: 500 },
    );
  }
}
