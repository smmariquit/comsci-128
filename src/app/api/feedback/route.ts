import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/server-client";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const subject = formData.get("subject") as string;
  const description = formData.get("description") as string;
  const screenshot = formData.get("screenshot") as File | null;

  // Get user info
  const supabase = await createSupabaseServerClient();
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let screenshotUrl = null;
  if (screenshot) {
    const fileExt = screenshot.name.split(".").pop();
    const fileName = `complaints/${userId}/${uuidv4()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from("complaints")
      .upload(fileName, screenshot, { contentType: screenshot.type });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    screenshotUrl = data?.path;
  }

  const { error } = await supabase.from("complaints").insert([
    {
      user_id: userId,
      subject,
      description,
      screenshot_url: screenshotUrl,
      status: "pending",
      created_at: new Date().toISOString(),
    },
  ]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// Manager: fetch all complaints
export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  // TODO: Add role check for manager
  const { data, error } = await supabase.from("complaints").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ complaints: data });
}
