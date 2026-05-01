import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/server-client";
import { createStudentProfile } from "@/services/student-service";
import { userService } from "@/app/lib/services/user-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.googleSignup) {
      try {
        const supabase = await createSupabaseServerClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          return NextResponse.json(
            { message: "Authentication required." },
            { status: 401 },
          );
        }

        if (body.account_email && user.email && body.account_email !== user.email) {
          return NextResponse.json(
            { message: "Email mismatch for Google signup." },
            { status: 400 },
          );
        }

        const createdUser = await userService.finalizeGoogleSignup(user, body);
        await createStudentProfile(createdUser.account_number);

        return NextResponse.json(
          { message: "User registered successfully.", user: createdUser },
          { status: 201 },
        );
      } catch (finalizationError: any) {
        return NextResponse.json(
          {
            message: "Registration failed. Please try signing up again.",
            error: finalizationError.message || "An error occurred during registration.",
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
