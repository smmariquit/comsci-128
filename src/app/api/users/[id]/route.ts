import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/services/user-service";

// For retrieving profile information of current user
// Default route for /profile/api
export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		/*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */
		const { id } = await params;

		// Check request/call user service
		const user = await getProfile(Number(id));

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
