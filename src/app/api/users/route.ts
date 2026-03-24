import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getAllProfile, updateProfile } from "@/services/user-service";

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

export async function PATCH(request: NextRequest) {
	try {
		// Check auth
		const headersList = await headers();
		const userId = headersList.get("x-user-id"); //must be added by middleware after user auth

		if (!userId) {
			return NextResponse.json(
				{
					message: "Unauthorized: Invalid Token.",
				},
				{ status: 401 },
			);
		}

		const updates = await request.json();

		const result = await updateProfile(Number(userId), updates);

		if (result.error) {
			const status = result.error.includes("not found") ? 404 : 400;
			return NextResponse.json(
				{ message : result.error },
				{ status: 400 }
			);
		}

		return NextResponse.json(
			{ message: "Profile updated successfully.", data: result.data },
			{ status: 200 }
		);


	} catch (error: any) {
		console.error("Error updating user profile: ", error);
		return NextResponse.json(
			{ message: "Failed to update user.", error: error.message},
			{ status: 500 },
		)
	}
}
