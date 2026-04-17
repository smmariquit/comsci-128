import { profileAction } from "@/services/profile-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const manager = await profileAction.getManagerProfile(Number(id));

		// Send Response
		if (!manager) {
			// Manager not found
			return NextResponse.json(
				{ message: "manager not found." },
				{ status: 404 },
			);
		}

		// manager found
		return NextResponse.json(manager, { status: 200 });
	} catch (error: any) {
		console.error("Error fetching manager profile:", error);
		return NextResponse.json(
			{ message: "Failed to fetch manager.", error: error.message },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const body = await request.json();
		const { id } = await params;
		const updated = await profileAction.updateManagerProfile(
			Number(id),
			body,
		);

		// Send Response
		if (!updated) {
			// Student not found
			return NextResponse.json(
				{ message: "manager not found." },
				{ status: 404 },
			);
		}

		// Student found
		return NextResponse.json(updated, { status: 200 });
	} catch (error: any) {
		console.error("Error updating manager profile:", error);
		return NextResponse.json(
			{ message: "Failed to update manager.", error: error.message },
			{ status: 500 },
		);
	}
}
