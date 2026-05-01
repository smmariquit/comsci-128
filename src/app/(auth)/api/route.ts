import { type NextRequest, NextResponse } from "next/server";
import { userService } from "@/app/lib/services/user-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.googleSignup) {
      try {
        const updatedUser = await userService.finalizeGoogleSignup(body.account_email, body);

        return NextResponse.json(
          { message: "User registered successfully.", user: updatedUser },
          { status: 201 },
        );
      } catch (finalizationError: any) {
          
        const cleanupResult = await userService.cleanupGooglePlaceholder(body.account_email);
        return NextResponse.json(
          {
            message: "Registration failed. Please try signing up again.",
            error: finalizationError.message || "An error occurred during registration.",
            cleanup: cleanupResult,
          },
          { status: 500 },
        );
      }
    }

  } catch (error: any) {
    console.error("Error during registration:", error);
    return NextResponse.json(
      { message: error.message || "An error occurred during registration." },
      { status: 500 },
    );
  }
}
