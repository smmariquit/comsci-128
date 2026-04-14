import { NextRequest, NextResponse } from "next/server";
import { addHousingAdmin } from "@/services/housing-admin";

// POST /api/housing-admin
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Call housing admin service
        const newHousingAdmin = await addHousingAdmin(body);

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