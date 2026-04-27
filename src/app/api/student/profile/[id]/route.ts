import { profileAction } from "@/app/lib/services/profile-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	_request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const student = await profileAction.getStudentProfile(Number(id));

		// Send Response
		if (!student) {
			// Student not found
			return NextResponse.json(
				{ message: "student not found." },
				{ status: 404 },
			);
		}

		// Student found
		return NextResponse.json(student, { status: 200 });
	} catch (error: any) {
		console.error("Error fetching student profile:", error);
		return NextResponse.json(
			{ message: "Failed to fetch student.", error: error.message },
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
		const updated = await profileAction.updateStudentProfile(
			Number(id),
			body,
		);

		// Send Response
		if (!updated) {
			// Student not found
			return NextResponse.json(
				{ message: "student not found." },
				{ status: 404 },
			);
		}

		// Student found
		return NextResponse.json(updated, { status: 200 });
	} catch (error: any) {
		console.error("Error updating student profile:", error);
		return NextResponse.json(
			{ message: "Failed to update student.", error: error.message },
			{ status: 500 },
		);
	}
}
