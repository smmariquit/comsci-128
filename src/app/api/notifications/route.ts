import { NextRequest, NextResponse } from "next/server";
import { getStudentNotifications } from "@/app/lib/data/notifications-data";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const accountNumber = parseInt(searchParams.get("accountNumber") || "");

        if (isNaN(accountNumber)) {
            return NextResponse.json({ message: "Invalid account number." }, { status: 400 });
        }

        const notifications = await getStudentNotifications(accountNumber);
        return NextResponse.json(notifications, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Failed to fetch notifications." }, { status: 500 });
    }
}