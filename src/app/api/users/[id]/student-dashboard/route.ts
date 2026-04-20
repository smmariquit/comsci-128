import { NextRequest, NextResponse } from "next/server";
// Import from the new Service Layer location
import { getCompleteDashboardData } from "@/services/student-dashboard.service";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Updated to handle Next.js 15+ async params if applicable
) {
    try {
        const { id } = await params;
        const studentId = Number(id);

        if (isNaN(studentId)) {
            return NextResponse.json(
                { message: "Invalid student account number provided." },
                { status: 400 }
            );
        }

        // Call the Service Layer which now handles the coordination of queries and UI logic
        const dashboardData = await getCompleteDashboardData(studentId);

        // Check if data exists. History might be empty for new students, but application/billing are key indicators.
        if (!dashboardData || (!dashboardData.application && dashboardData.billing.length === 0)) {
            return NextResponse.json(
                { message: "No dashboard data found for this student." },
                { status: 404 }
            );
        }

        return NextResponse.json(dashboardData, { status: 200 });

    } catch (error: any) {
        console.error("Error in Dashboard Route:", error);
        return NextResponse.json(
            { message: "Failed to fetch dashboard data.", error: error.message },
            { status: 500 }
        );
    }
}