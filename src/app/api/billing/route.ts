import { NextResponse } from "next/server";
import { AppAction } from "@/app/lib/models/permissions";
import { validateAction } from "@/app/lib/services/authorization-service";
import { createSupabaseServerClient } from "@/app/lib/server-client";

export async function GET() {
  try {
    await validateAction(AppAction.BILL_STATUS);

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("bill")
      .select("*, manager!inner(*), student!inner(*)")
      .eq("is_deleted", false);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await validateAction(AppAction.ASSIGN_BILL);

    const body = await request.json();
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("bill")
      .insert([body])
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
