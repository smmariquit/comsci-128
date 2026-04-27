import { NextResponse } from "next/server";
import { housingService } from "@/app/lib/services/housing-service";

export async function GET() {
    try {
        const occupancyData = await housingService.getOccupancyRate(); 
        
        // Fail
        if (!occupancyData || occupancyData.length === 0) {
            return NextResponse.json(
                [],
                { status: 200 },
            );
        }


        // Success
        return NextResponse.json(occupancyData, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching Occupancy rate:", error);
        return NextResponse.json(
            [],
            { status: 200 },
        );
    }
}