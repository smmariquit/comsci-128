import { NextRequest, NextResponse } from "next/server";
import { findHousingById } from "@/app/lib/data/housing-data";
import {
	modifyHousing,
	removeHousing,
} from "@/app/lib/services/housing-service";

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ housingId: string }> },
) {
	try {
		const { housingId } = await params;

		// Pass to service as Number to match DB bigint
		const deleted = await removeHousing(Number(housingId));

		if (!deleted) {
			return NextResponse.json(
				{ error: "Housing record not found or already inactive" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{
				message: "Housing record successfully deactivated",
				data: deleted,
			},
			{ status: 200 },
		);
	} catch (error: any) {
		console.error("Error:", error);

		// If the error came from our service throw, it will have a message
		const errorMessage = error.message || "Internal Server Error";

		// Check for specific keywords to set the status code
		let status = 500;
		if (errorMessage.includes("not found")) status = 404;
		if (errorMessage.includes("empty")) status = 400;

		return NextResponse.json({ error: errorMessage }, { status: status });
	}
}

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ housingId: string }> },
) {
	try {
		const { housingId } = await params;
		const data = await findHousingById(housingId);

		if (!data) {
			return NextResponse.json(
				{ error: "Housing record not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({ data }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ housingId: string }> },
) {
	try {
		const { housingId } = await params;
		const body = await req.json();

		const updated = await modifyHousing(Number(housingId), body);

		if (!updated) {
			return NextResponse.json(
				{ error: "Housing record not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json(
			{ message: "Housing updated successfully", data: updated },
			{ status: 200 },
		);
	} catch (error: any) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
