import { NextRequest, NextResponse } from "next/server";
import { landlordService } from "@/app/lib/services/landlord-service";
import { NewManager } from "@/app/lib/models/manager";

// POST /api/landlord/[accountNumber]
export async function POST (
	_req: NextRequest,
	{ params }: { params: Promise<{ accountNumber: string, accountDetails: NewManager }> },
) {
	try {
		const { accountNumber, accountDetails } = await params;
		const parsedAccountNumber = Number(accountNumber);

		if (!Number.isInteger(parsedAccountNumber) || parsedAccountNumber <= 0) {
			return NextResponse.json(
				{ error: "Invalid landlord account number." },
				{ status: 400 },
			);
		}

        const newLandlord = landlordService.addLandlord(parsedAccountNumber,accountDetails);


		return NextResponse.json({ data: { newLandlord } }, { status: 200 });
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

