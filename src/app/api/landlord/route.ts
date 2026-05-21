import { NextRequest, NextResponse } from "next/server";
import { landlordService } from "@/app/lib/services/landlord-service";

// POST /api/landlord
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call landlord service
    const newLandlord = await landlordService.addLandlord(
      body,
      body.managerDetails || body,
    );

    // OK Response upon successful creation
    return NextResponse.json(
      { message: "Landlord created successfully.", user: newLandlord },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating landlord:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create landlord." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const landlord = await landlordService.fetchAllHousingAdmins();

    return NextResponse.json({ data: landlord }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
