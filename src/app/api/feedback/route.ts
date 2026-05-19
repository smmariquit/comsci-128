import { feedbackService } from "@/app/lib/services/feedback-service";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/server-client";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const subject = formData.get("subject") as string;
  const text = formData.get("description") as string;
  const feedback_type = formData.get("type") as string;
  const category = formData.get("category") as string;
  const screenshot = formData.get("screenshot") as File | null;
  const involved_housing_id = formData.get("involved_housing_id") as string | null;
  const involved_manager_id = formData.get("involved_manager_id") as string | null;

  // Get user info (prefer cookie-set account_number, fallback to auth metadata)
  const supabase = await createSupabaseServerClient();
  const accountCookie = req.cookies.get("account_number")?.value;
  let accountNumber: number | null = accountCookie ? Number(accountCookie) : null;
  if (!accountNumber) {
    const { data: userData } = await supabase.auth.getUser();
    const metaAccount = (userData as any)?.user?.user_metadata?.account_number;
    if (metaAccount) accountNumber = Number(metaAccount);
  }

  if (!accountNumber) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let screenshotUrl = null;
  if (screenshot) {
    const fileExt = screenshot.name.split(".").pop();
    const fileName = `feedback/${accountNumber}/${uuidv4()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("feedback")
      .upload(fileName, screenshot, { contentType: screenshot.type });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    screenshotUrl = data?.path;
  }

  const payload: any = {
    account_number: accountNumber,
    subject,
    text,
    feedback_type,
    category,
    status: "Pending",
    created_at: new Date().toISOString(),
    updated_at: null,
    screenshot_url: screenshotUrl,
  };

  if (involved_housing_id) payload.involved_housing_id = Number(involved_housing_id);
  if (involved_manager_id) payload.involved_manager_id = Number(involved_manager_id);

  await feedbackService.createFeedback(payload);

  return NextResponse.json({ ok: true });
}

// Manager: fetch all feedback
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  // TODO: Add role check for manager
  const { data, error } = await supabase.from("feedback").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ feedback: data });
}
