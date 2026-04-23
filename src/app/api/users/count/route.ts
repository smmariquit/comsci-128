import { NextResponse } from "next/server";
import { userService } from "@/services/user-service";

export async function GET() {
    try {
        const totalCount = await userService.getUserCount();
        const activeCount = await userService.getActiveUserCount();

        if (totalCount === null || activeCount === null) {
            return NextResponse.json(
                { message: "User count not found." },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { totalCount, activeCount },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Error fetching user count:", error);
        return NextResponse.json(
            { message: "Failed to fetch user count.", error: error.message },
            { status: 500 },
        );
    }
}