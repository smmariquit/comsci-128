import { NextRequest, NextResponse } from "next/server";
import { addHousing, getHousing } from "@/app/lib/services/housing-service";

// Receive housing data from the frontend and save it to the DB
// Provide a list of all available housing/dorms
export async function GET(req: NextRequest) {
	try {
		const authHeader = req.headers.get("authorization");
		if (!authHeader)
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);

		const data = await getHousing();
		return NextResponse.json({ data }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	try {
		const authHeader = req.headers.get("authorization");
		if (!authHeader)
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 },
			);

		const body = await req.json();
		const result = await addHousing(body);
		return NextResponse.json({ data: result }, { status: 201 });
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
