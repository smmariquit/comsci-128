import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { landlordService } from "@/services/landlord-service";

export async function GET(
	_req: NextRequest,
	{ params }: { params: Promise<{ accountNumber: string }> },
) {
	try {
		const { accountNumber } = await params;
		const parsedAccountNumber = Number(accountNumber);

		if (!Number.isInteger(parsedAccountNumber) || parsedAccountNumber <= 0) {
			return NextResponse.json(
				{ error: "Invalid landlord account number." },
				{ status: 400 },
			);
		}

		const grossRevenue =
			await landlordService.fetchGrossRevenueByLandlord(parsedAccountNumber);

		return NextResponse.json({ data: { grossRevenue } }, { status: 200 });
	} catch (error: unknown) {
		if (error instanceof Error) {
			if (error.message === "Invalid landlord account number.") {
				return NextResponse.json({ error: error.message }, { status: 400 });
			}
		}

		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
