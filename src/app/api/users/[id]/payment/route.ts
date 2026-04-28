import { NextRequest, NextResponse } from "next/server";
import { completePaymentProcess } from "@/services/student-dashboard.service";

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { transactionId, publicUrl } = body;

        if (!transactionId || !publicUrl) {
            return NextResponse.json(
                { message: "Missing transactionId or publicUrl" },
                { status: 400 }
            );
        }

        // Call the service layer to handle the DB update
        const updatedBill = await completePaymentProcess(transactionId, publicUrl);

        return NextResponse.json({
            message: "Payment proof linked successfully!",
            data: updatedBill
        }, { status: 200 });

    } catch (error: any) {
        console.error("Payment Route Error:", error);
        return NextResponse.json(
            { message: "Failed to link payment proof.", error: error.message },
            { status: 500 }
        );
    }
}