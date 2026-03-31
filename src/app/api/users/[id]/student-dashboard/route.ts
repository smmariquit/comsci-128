import { NextRequest, NextResponse } from "next/server";
import { getCompleteDashboardData } from "@/app/lib/data/student-dashboard";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } } 
) {
    try {
        const { id } = await params;
        const studentId = Number(id);

        const dashboardData = await getCompleteDashboardData(studentId);

        if (!dashboardData || (!dashboardData.application && dashboardData.billing.length === 0)) {
            return NextResponse.json(
                { message: "No dashboard data found for this student." },
                { status: 404 }
            );
        }

        return NextResponse.json(dashboardData, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching dashboard:", error);
        return NextResponse.json(
            { message: "Failed to fetch dashboard data.", error: error.message },
            { status: 500 }
        );
    }
}