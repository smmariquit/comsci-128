import { NextRequest, NextResponse } from "next/server";
import { housingAdminService } from "@/app/lib/services/housing-admin";

// POST /api/housing-admin
export async function POST(request: NextRequest) {
    try {
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { message: "Malformed JSON body." },
                { status: 400 }
            );
        }

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json(
                { message: "Housing admin data is required." },
                { status: 400 }
            );
        }

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