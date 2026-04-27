import { NextRequest, NextResponse } from "next/server";
import { landlordService } from "@/app/lib/services/landlord-service";
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
        { error: "Invalid landlord account number." },
        { status: 400 }
      );
    }

    const newLandlord = landlordService.addLandlord(
      parsedAccountNumber,
      accountDetails
    );

    return NextResponse.json(
      { data: newLandlord },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}