import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getProfile } from "@/services/user-service";

// For retrieving profile information of current user
// Default route for /profile/api
export async function GET(request: NextRequest) {
	try {
		// Check auth
		const headersList = await headers();
		const userId = headersList.get("account_number"); //must be added by middleware after user auth

		if (!userId) {
			return NextResponse.json(
				{
					message: "Unauthorized: Invalid Token.",
				},
				{ status: 401 },
			);
		}
		// Check request/call user service
		const user = await getProfile(userId);

		// Send Response
		if (!user) {
			// User not found
			return NextResponse.json(
				{ message: "User not found." },
				{ status: 404 },
			);
		}

		// User found
		return NextResponse.json(user, { status: 200 });
	} catch (error: any) {
		console.error("Error fetching user profile:", error);
		return NextResponse.json(
			{ message: "Failed to fetch user.", error: error.message },
			{ status: 500 },
		);
	}
}
