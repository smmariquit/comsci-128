import { NextRequest, NextResponse } from "next/server";
import { addStudent } from "@/services/student-service";

// POST /api/student
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        // 1. Verify CAPTCHA
        const { captchaToken } = body;
        if (!captchaToken) {
            return NextResponse.json({ message: "CAPTCHA token is missing." }, { status: 400 });
        }

        const turnstileRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `secret=${process.env.TURNSTILE_SECRET_KEY}&response=${captchaToken}`,
        });

        const turnstileData = await turnstileRes.json();
        if (!turnstileData.success) {
            console.error("Turnstile verification failed:", turnstileData);
            return NextResponse.json({ message: "CAPTCHA verification failed." }, { status: 403 });
        }

        const userDetails = body?.userDetails ?? body;
        const studentDetails = body?.studentDetails;
        const studentAcademicDetails = body?.studentAcademicDetails;

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