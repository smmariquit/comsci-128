import { NextRequest, NextResponse } from "next/server";
import { applicationService } from "@/app/lib/services/application-service";
import { applicationData } from "@/app/lib/data/application-data";
import { sendApplicationStatusEmail } from "@/app/lib/services/email-service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  try {
    // TODO: UNCOMMENT WHEN AUTH MIDDLEWARE IS FULLY IMPLEMENTED

    // const authHeader = request.headers.get("authorization")
    // if (!authHeader || !authHeader.startsWith("Bearer ")) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    // }

    const { applicationId } = await params;
    const application_Id = Number(applicationId);

    if (isNaN(application_Id)) {
      return NextResponse.json(
        { message: "Invalid application ID." },
        { status: 400 },
      );
    }

    const { application_status } = await request.json();
    if (!application_status) {
      return NextResponse.json(
        { message: "application_status is required." },
        { status: 400 },
      );
    }

    const validStatuses = [
      "Pending Manager Approval",
      "Pending Admin Approval",
      "Approved",
      "Rejected",
      "Cancelled",
    ];
    if (!validStatuses.includes(application_status)) {
      return NextResponse.json(
        { message: "Invalid status value." },
        { status: 400 },
      );
    }

    const updated = await applicationService.updateApplicationStatus(
      application_Id,
      application_status,
    );
    if (!updated) {
      return NextResponse.json(
        { message: "Application not found." },
        { status: 404 },
      );
    }
    //email
    try {
      const detail = await applicationData.getApplicationDetailById(application_Id);
      const user = (detail?.student as any)?.user;
      const studentEmail = user?.email;
      const studentName = `${user?.first_name} ${user?.last_name}`;
      const housingName = detail?.housing_name ?? "the housing";

      if (
        studentEmail &&
        (application_status === "Pending Admin Approval" ||
          application_status === "Rejected")
      ) {
        await sendApplicationStatusEmail(
          studentEmail,
          studentName,
          housingName,
          application_status,
        );
      }
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // don't block the response if email fails
    }


    return NextResponse.json(
      { message: `Application processed successfully.` },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating application status:", error);

    const isAuthError =
      error.message.includes("Unauthorized") ||
      error.message.includes("Access Denied");

    const status = isAuthError ? 403 : 500;
    const responseMessage = isAuthError
      ? error.message
      : "Internal Server Error";

    return NextResponse.json(
      { message: responseMessage, error: error.message },
      { status: status },
    );
  }
}
