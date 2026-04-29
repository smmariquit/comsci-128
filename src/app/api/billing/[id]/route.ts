import { NextResponse } from "next/server";
import { AppAction } from "@/app/lib/models/permissions";
import { validateAction } from "@/app/lib/services/authorization-service";
import { createSupabaseServerClient } from "@/app/lib/server-client";

export async function PUT(request: Request, context: any) {
  try {
    await validateAction(AppAction.UPDATE_BILL_STATUS);

    const rawParams = context?.params;
    const params = typeof rawParams?.then === "function" ? await rawParams : rawParams;
    const id = Number(params?.id);
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("bill")
      .update({ status: "Paid", date_paid: new Date().toISOString() })
      .eq("transaction_id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    await validateAction(AppAction.UPDATE_BILL_STATUS);

    const rawParams = context?.params;
    const params = typeof rawParams?.then === "function" ? await rawParams : rawParams;
    const id = Number(params?.id);
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("bill")
      .update({ is_deleted: true })
      .eq("transaction_id", id);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
