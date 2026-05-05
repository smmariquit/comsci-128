import { NextResponse } from "next/server";
import { managerService } from "@/app/lib/services/manager-service";

export async function GET() {
    try {
    
        const count = await managerService.getManagerCount();

        // Fail
        if (count === null || count === undefined) {
            return NextResponse.json(
                { message: "Manager count not found." },
                { status: 404 },
            );
        }

        // Success
        return NextResponse.json(
            { count },
            { status: 200 },
        );

    } catch (error: any) {
        console.error("Error fetching manager count:", error);
        return NextResponse.json(
            { message: "Failed to fetch manager count.", error: error.message },
            { status: 500 },
        );
    }
}