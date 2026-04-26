import { type NextRequest, NextResponse } from "next/server";
import { housingService } from "@/app/lib/services/housing-service";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ housingId: string }> },
) {
	try {
		const { housingId } = await params;
		const parsedHousingId = Number(housingId);

		if (!Number.isFinite(parsedHousingId)) {
			return NextResponse.json(
				{ error: "Invalid housing ID" },
				{ status: 400 },
			);
		}

		const formData = await request.formData();
		const image = formData.get("image");

		if (!(image instanceof File)) {
			return NextResponse.json(
				{ error: "Image file is required" },
				{ status: 400 },
			);
		}

		const updatedHousing = await housingService.uploadHousingImage(
			parsedHousingId,
			image,
		);

		if (!updatedHousing) {
			return NextResponse.json(
				{ error: "Housing record not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({ data: updatedHousing }, { status: 200 });
	} catch (error: any) {
		return NextResponse.json(
			{ error: error?.message ?? "Internal Server Error" },
			{ status: 500 },
		);
	}
}
