import { NextRequest, NextResponse } from "next/server";
import { addLandlord } from "@/services/landlord-service";

// POST /api/landlord
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Call landlord service
        const newLandlord = await addLandlord(body, body.password);

        // OK Response upon successful creation
        return NextResponse.json(
            { message: "Landlord created successfully.", user: newLandlord },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating landlord:", error);
        return NextResponse.json(
            { message: error.message || "Failed to create landlord." },
            { status: 500 }
        );
    }
}
