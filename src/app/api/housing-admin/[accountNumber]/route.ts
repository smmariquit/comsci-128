import { NextRequest, NextResponse } from "next/server";
import { housingAdminService } from "@/app/lib/services/housing-admin";
import { NewManager } from "@/app/lib/models/manager";

// POST /api/landlord/[accountNumber]
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ accountNumber: string }> }
) {
  try {
    const resolvedParams = await params; 
    const { accountNumber } = resolvedParams;

    console.log("params:", resolvedParams);

    const parsedAccountNumber = Number(accountNumber);

    const accountDetails: NewManager = await req.json();

    if (!Number.isInteger(parsedAccountNumber) || parsedAccountNumber <= 0) {
      return NextResponse.json(
        { error: "Invalid account number." },
        { status: 400 }
      );
    }

    const newHousingAdmin = housingAdminService.addHousingAdmin(
      parsedAccountNumber,
      accountDetails
    );

    return NextResponse.json(
      { data: newHousingAdmin},
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}