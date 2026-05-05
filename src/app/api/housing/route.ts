import { type NextRequest, NextResponse } from "next/server";
import { housingService } from "@/app/lib/services/housing-service";

// Receive housing data from the frontend and save it to the DB
// Provide a list of all available housing/dorms
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Malformed JSON body." },
        { status: 400 },
      );
    }

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json(
        { error: "Housing data is required." },
        { status: 400 },
      );
    }
    const result = await housingService.addHousing(body);
    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(_request: NextRequest) {
  try {
    const data = await housingService.getAllHousing();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
