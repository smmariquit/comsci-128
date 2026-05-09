import { NextResponse } from "next/server";
import { billingService } from "@/app/lib/services/billing-service";

export async function PUT(request: Request, context: any) {
  try {
    const rawParams = context?.params;
    const params = typeof rawParams?.then === "function" ? await rawParams : rawParams;
    const id = Number(params?.id);

    const data = await billingService.markAsPaid(id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: any) {
  try {
    const rawParams = context?.params;
    const params = typeof rawParams?.then === "function" ? await rawParams : rawParams;
    const id = Number(params?.id);

    const data = await billingService.removeBill(id);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
