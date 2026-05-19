import { NextRequest, NextResponse } from "next/server";
import { addStudent } from "@/services/student-service";

// POST /api/student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      authUserAlreadyCreated: _authUserAlreadyCreated,
      ...bodyUserDetails
    } = body ?? {};
    const userDetails = body?.userDetails ?? bodyUserDetails;
    const studentDetails = body?.studentDetails;
    const studentAcademicDetails = body?.studentAcademicDetails;
    const authUserAlreadyCreated = body?.authUserAlreadyCreated === true;

    const result = await addStudent(
      userDetails,
      studentDetails,
      studentAcademicDetails,
      { authUserAlreadyCreated },
    );

    return NextResponse.json(
      {
        message: "Student created successfully.",
        user: result.user,
        student: result.student,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create student." },
      { status: 500 },
    );
  }
}
