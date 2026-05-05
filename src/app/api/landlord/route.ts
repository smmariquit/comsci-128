import { NextRequest, NextResponse } from "next/server";
import { landlordService } from "@/app/lib/services/landlord-service";

// POST /api/landlord
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
                { message: "Landlord data is required." },
                { status: 400 }
            );
        }

        // Call landlord service
        const newLandlord = await landlordService.addLandlord(body, body.managerDetails || body);

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

export async function GET() {
    return NextResponse.json(
        { message: "Method not allowed." },
        { status: 405, headers: { Allow: "POST" } }
    );
}
