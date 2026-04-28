import { NextRequest, NextResponse } from "next/server";
import { housingAdminService } from "@/app/lib/services/housing-admin";

// POST /api/housing-admin
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Call housing admin service
        const newHousingAdmin = await housingAdminService.addHousingAdmin(body, body.managerDetails || body);

        // OK Response upon successful creation
        return NextResponse.json(
            { message: "Housing admin created successfully.", user: newHousingAdmin },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating housing admin:", error);
        return NextResponse.json(
            { message: error.message || "Failed to create housing admin." },
            { status: 500 }
        );
    }
}

export async function GET() {
  try {
    const manager = await housingAdminService.fetchAllHousingAdmins();

    return NextResponse.json(
      { data: manager },
      { status: 200 } // also fix this (explained below)
    );
  } catch (error: any) {
    console.error("GET housing-admin error:", error); // 👈 ADD THIS
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}