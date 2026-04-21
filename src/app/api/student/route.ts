import { NextRequest, NextResponse } from "next/server";
import { addStudent } from "@/services/student-service";

// POST /api/student
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Call student service
        const newStudent = await addStudent(body, body.password, body.student_number);

        // OK Response upon successful creation
        return NextResponse.json(
            { message: "Student created successfully.", student: newStudent },
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