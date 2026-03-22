import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { getProfile, createUser } from "@/services/user-service";

// For retrieving profile information of current user
// Default route for /profile/api
export async function GET(request: NextRequest) {
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
		// Check request/call user service
		const user = await getProfile(Number(userId));

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

// For creating a new user record -- access endpoint when signing up
// Default route for /api/users
export async function POST(request: NextRequest) {
	try {
		// Check auth
		const headersList = await headers();
		const userId = headersList.get("x-user-id");

		if (!userId) {
			return NextResponse.json(
				{ message: "Unauthorized: Invalid Token." },
				{ status: 401 }
			);
		}

		// Get request body
		const body = await request.json();

		// Call user service
		const newUser = await createUser(body);

		// OK Response upon successful creation
		return NextResponse.json(
			{ message: "User created successfully.", user: newUser },
			{ status: 201 }
		);

	} catch (error: any) {
		console.error("Error creating user:", error);
		return NextResponse.json(
			{ message: error.message || "Failed to create user." },
			{ status: 500 }
		);
	}
}