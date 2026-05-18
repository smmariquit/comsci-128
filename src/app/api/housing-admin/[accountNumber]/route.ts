import { NextRequest, NextResponse } from "next/server";
import { housingAdminService } from "@/app/lib/services/housing-admin";
import { NewManager } from "@/app/lib/models/manager";

// POST /api/housing-admin/[accountNumber]
export async function POST(
  req: NextRequest,
  { params }: { params: { accountNumber: string } }
) {
  try {
    const { accountNumber } =  await params;

    const parsedAccountNumber = Number(accountNumber);

    if (!Number.isInteger(parsedAccountNumber) || parsedAccountNumber <= 0) {
      return NextResponse.json(
        { error: "Invalid account number." },
        { status: 400 }
      );
    }

    const accountDetails: NewManager = await req.json();

    console.log("accountDetails:", accountDetails);

    const newHousingAdmin = await housingAdminService.addHousingAdmin(
      parsedAccountNumber,
      accountDetails
    );

    return NextResponse.json(
      { data: newHousingAdmin },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Housing Admin API Error:", error);

    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}