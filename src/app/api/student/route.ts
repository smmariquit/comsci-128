import { NextRequest, NextResponse } from "next/server";
import { addStudent } from "@/services/student-service";

// POST /api/student
export async function POST(request: NextRequest) {
    try {
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { message: "Malformed JSON body." },
                { status: 400 }
            );
        }

        if (!body || typeof body !== "object" || Array.isArray(body)) {
            return NextResponse.json(
                { message: "Student data is required." },
                { status: 400 }
            );
        }

        const payload = body as Record<string, any>;
        const userDetails = payload.userDetails ?? payload;
        const studentDetails = payload.studentDetails;
        const studentAcademicDetails = payload.studentAcademicDetails;

        const result = await addStudent(userDetails, studentDetails, studentAcademicDetails);

        return NextResponse.json(
            { message: "Student created successfully.", user: result.user, student: result.student },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error creating student:", error);
        return NextResponse.json(
            { message: error.message || "Failed to create student." },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json(
        { message: "Method not allowed." },
        { status: 405, headers: { Allow: "POST" } }
    );
}