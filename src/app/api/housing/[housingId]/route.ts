import { NextRequest, NextResponse } from "next/server";
import { findHousingById } from "@/app/lib/data/housing";
import { modifyHousing } from "@/app/lib/services/housing-service";

// Retrieve a specific dorm's details using the ID from the URL
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
