import { type NextRequest, NextResponse } from "next/server";
import { housingService } from "@/app/lib/services/housing-service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ housingId: string }> },
) {
  try {
    const { housingId } = await params;
    const data = await housingService.getHousing(Number(housingId));

    if (!data) {
      return NextResponse.json(
        { error: "Housing record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (_error: any) {
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

    const updated = await housingService.updateHousing(Number(housingId), body);

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
  } catch (_error: any) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ housingId: string }> },
) {
  try {
    const { housingId } = await params;

    // Pass to service as Number to match DB bigint
    const deleted = await housingService.deactivateHousing(Number(housingId));

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
