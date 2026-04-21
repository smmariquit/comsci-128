import { type NextRequest, NextResponse } from "next/server";
import { userService } from "@/services/user-service";

// For creating a new user record -- access endpoint when signing up
// Default route for /api/users
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();

    // Call user service
    const newUser = await userService.addUser(body);

    // OK Response upon successful creation
    return NextResponse.json(
      { message: "User created successfully.", user: newUser },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create user." },
      { status: 500 },
    );
  }
}

// For retrieving profile information of current user
// Default route for /profile/api
export async function GET() {
  try {
    /*
            TODO:
            - authentication middleware
            - role access (role guard) middleware
        */
    // Check request/call user service
    const user = await userService.getAllUser();

    // Send Response
    if (!user) {
      // User not found
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // User found
    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: "Failed to fetch user.", error: error.message },
      { status: 500 },
    );
  }
}
