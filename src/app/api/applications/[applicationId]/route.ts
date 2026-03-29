

import { NextRequest, NextResponse } from "next/server";
import { applicationService } from "@/app/lib/services/application-service";

export async function PATCH(
    
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const applicationId = Number(id)

    if (isNaN(applicationId)) {
      return NextResponse.json({ message: "Invalid application ID." }, { status: 400 })
    }

    const { application_status } = await request.json()
    if (!application_status) {
      return NextResponse.json({ message: "application_status is required." }, { status: 400 })
    }

    const validStatuses = ["Approved", "Rejected", "Pending", "Cancelled"]
    if (!validStatuses.includes(application_status)) {
      return NextResponse.json({ message: "Invalid status value." }, { status: 400 })
    }

    const updated = await applicationService.updateApplicationStatus(applicationId, application_status)
    if (!updated) {
      return NextResponse.json({ message: "Application not found." }, { status: 404 })
    }

    return NextResponse.json({ message: `Application ${application_status} successfully.` }, { status: 200 })

  } catch (error: any) {
    console.error("Error updating application status:", error)
    return NextResponse.json(
      { message: "Failed to update application status.", error: error.message },
      { status: 500 }
    )
  }
}