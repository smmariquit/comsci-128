import { NextRequest, NextResponse } from "next/server";
import { housingAdminService } from "@/app/lib/services/housing-admin";

// POST /api/landlord
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Call landlord service
    const newLandlord = await housingAdminService.addHousingAdmin(
      body,
      body.managerDetails || body,
    );

    // OK Response upon successful creation
    return NextResponse.json(
      { message: "Housing Admin created successfully."},
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating housing admin:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create housing admin." },
      { status: 500 },
    );
  }
}