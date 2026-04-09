import { NextRequest, NextResponse } from "next/server";
import { userService } from "@/app/lib/services/user-service";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const newStudent = await userService.addUser(body);

        return NextResponse.json(  
            { message: "User registered successfully.", user: newStudent },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error during registration:", error);
        return NextResponse.json(
            { message: error.message ||  "An error occurred during registration." },
            { status: 500 }
        );
    }
}