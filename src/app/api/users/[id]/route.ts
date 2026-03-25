import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/services/user-service";

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
		const user = await userService.getUser(Number(id));

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

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		/*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */
		const updates = await request.json();
		const { id } = await params;

		const result = await userService.updateUser(Number(id), updates);

		if (result.error) {
			const status = result.error.includes("not found") ? 404 : 400;
			return NextResponse.json(
				{ message: result.error },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ message: "Profile updated successfully.", data: result.data },
			{ status: 200 },
		);
	} catch (error: any) {
		console.error("Error updating user profile: ", error);
		return NextResponse.json(
			{ message: "Failed to update user.", error: error.message },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		if (!id) {
			return NextResponse.json(
				{ message: "id is required" },
				{ status: 400 },
			);
		}

		const user = await userService.deactivateUser(Number(id));
		if (!user)
			return NextResponse.json(
				{ message: "User not found." },
				{ status: 404 },
			);

		return NextResponse.json(
			{ message: "User deactivated successfully." },
			{ status: 200 },
		);
	} catch (error: any) {
		console.error("Error deactivating user:", error);
		return NextResponse.json(
			{ message: "Failed to deactivate user.", error: error.message },
			{ status: 500 },
		);
	}
}
