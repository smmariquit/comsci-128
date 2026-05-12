import { NextResponse } from "next/server";
import { billingService } from "@/app/lib/services/billing-service";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const managedHousingIds = url.searchParams
      .getAll("managedHousingIds")
      .flatMap((value) => value.split(","))
      .map((value) => Number(value))
      .filter((value) => Number.isFinite(value));

    const data = await billingService.fetchAllBills(managedHousingIds);
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = await billingService.createBill(body);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
