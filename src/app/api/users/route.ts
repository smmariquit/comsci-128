import { NextRequest, NextResponse } from "next/server";
import { getAllProfile } from "@/services/user-service";

// For retrieving profile information of current user
// Default route for /profile/api
export async function GET(request: NextRequest) {
	try {
		/*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */
		// Check request/call user service
		const users = await getAllProfile();

		// Send Response
		if (!users || users.length === 0) {
			// User not found
			return NextResponse.json(
				{ message: "List of users not found." },
				{ status: 404 },
			);
		}

		// User found
		return NextResponse.json(users, { status: 200 });
	} catch (error: any) {
		console.error("Error fetching user profile:", error);
		return NextResponse.json(
			{ message: "Failed to fetch user.", error: error.message },
			{ status: 500 },
		);
	}
}


