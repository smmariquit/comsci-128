import { NextRequest, NextResponse } from "next/server";
import { housingService } from "@/app/lib/services/housing-service";

// Receive housing data from the frontend and save it to the DB
// Provide a list of all available housing/dorms
export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const result = await housingService.addHousing(body);
		return NextResponse.json({ data: result }, { status: 201 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function GET(request: NextRequest) {
	try {
		const data = await housingService.getAllHousing();
		return NextResponse.json({ data }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
