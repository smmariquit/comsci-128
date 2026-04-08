import { NextResponse } from "next/server";
import { userService } from "@/services/user-service";

export async function GET() {
	try {
	
		const count = await userService.getUserCount();

        // Fail
		if (!count) {
			return NextResponse.json(
				{ message: "User count not found." },
				{ status: 404 },
			);
		}

		// Success
		return NextResponse.json(
			{ count },
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