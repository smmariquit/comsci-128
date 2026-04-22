import { NextResponse } from "next/server";
import { housingService } from "@/app/lib/services/housing-service";

export async function GET() {
    try {

        const count = await housingService.getHousingCount();

        // Fail
        if (!count) {
            return NextResponse.json(
                { message: "Housing count not found." },
                { status: 404 },
            );
        }

        // Success
        return NextResponse.json(
            { count },
            { status: 200 },
        );

    } catch (error: any) {
        console.error("Error fetching housing count:", error);
        return NextResponse.json(
            { message: "Failed to fetch housing count.", error: error.message },
            { status: 500 },
        );
    }
}