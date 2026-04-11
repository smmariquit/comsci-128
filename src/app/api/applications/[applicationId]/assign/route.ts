

import { NextRequest, NextResponse } from "next/server";
import { applicationService } from "@/app/lib/services/application-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const {applicationId: rawId} = await params
    const applicationId = Number(rawId)

    if (isNaN(applicationId)) {
      return NextResponse.json({ message: "Invalid application ID." }, { status: 400 })
    }

    const { roomId, studentAccountNumber, moveoutDate } = await request.json()

    if (!roomId || !studentAccountNumber || !moveoutDate) {
      return NextResponse.json(
        { message: "roomId, studentAccountNumber and moveoutDate are required." },
        { status: 400 }
      )
    }

    const result = await applicationService.assignApplicantToRoom(
      applicationId,
      roomId,
      studentAccountNumber,
      moveoutDate
    )

    return NextResponse.json(
      { message: "Applicant assigned successfully.", result },
      { status: 200 }
    )

  } catch (error: any) {
    console.error("Error assigning applicant:", error)
    return NextResponse.json(
      { message: "Failed to assign applicant.", error: error.message },
      { status: 500 }
    )
  }
}