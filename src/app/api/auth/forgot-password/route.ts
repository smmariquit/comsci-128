import { createClient } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const origin = req.nextUrl.origin;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/forgot-password`,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Email Sent!" }, { status: 200 });
}
