import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@/models/permissions";
import { createSupabaseServerClient } from "@/lib/server-client";
import { getCurrentUserRole } from "@/services/authorization-service";
import { userService } from "@/services/user-service";

const roleRedirects: Record<UserRole, string> = {
  public: "/login",
  student: "/student",
  landlord: "/manager",
  housing_admin: "/manager",
  system_admin: "/admin",
};

function toRole(userType?: string | null): UserRole {
  const normalizedUserType = userType?.toLowerCase();

  if (normalizedUserType === "student") return "student";
  if (normalizedUserType === "manager") return "landlord";
  if (normalizedUserType === "system admin") return "system_admin";

  return "public";
}

async function resolveManagerRole(accountNumber: number) {
  const supabase = await createSupabaseServerClient();
  const { data: managerData, error } = await supabase
    .from("manager")
    .select("manager_type")
    .eq("account_number", accountNumber)
    .single();

  if (error) {
    return "landlord" as UserRole;
  }

  const managerType = managerData?.manager_type?.toLowerCase();
  if (managerType === "housing administrator") 
    return "housing_admin" as UserRole;

  return "landlord" as UserRole;
}

function buildRegisterData(
  profile: { firstName: string; lastName: string; email: string },
  error?: string,
) {
  return {
    googleFirstName: profile.firstName,
    googleLastName: profile.lastName,
    googleEmail: profile.email,
    ...(error && { googleError: error }),
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const intent = body?.intent === "signup" ? "signup" : "login";

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const profile = {
      email: user.email || user.user_metadata?.email || "",
      firstName:
        user.user_metadata?.full_name?.split(/\s+/).filter(Boolean)[0] ||
        user.user_metadata?.name?.split(/\s+/).filter(Boolean)[0] ||
        "",
      lastName:
        user.user_metadata?.full_name?.split(/\s+/).filter(Boolean).slice(1).join(" ") ||
        user.user_metadata?.name?.split(/\s+/).filter(Boolean).slice(1).join(" ") ||
        "",
    };

    const existingUser = await userService.findGoogleUser(user);

    if (intent === "signup") {
      if (existingUser) {
        return NextResponse.json(
          {
            error: "account already exist",
            redirectTo: "/register",
            googleData: buildRegisterData(profile, "account already exist"),
          },
          { status: 409 },
        );
      }

      const createdUser = await userService.createGooglePlaceholderUser(user);

      return NextResponse.json({
        role: "student",
        redirectTo: "/register",
        googleData: buildRegisterData(profile),
        user: createdUser,
      });
    }

    const dbUser = existingUser || (await userService.findOrCreateGoogleUser(user));

    let role = await getCurrentUserRole();

    // when account_number metadata is not yet present in auth session.
    if (role === "public") {
      role = toRole(dbUser?.user_type);
      if (role === "landlord") {
        role = await resolveManagerRole(dbUser.account_number);
      }
    }

    return NextResponse.json({ role, redirectTo: roleRedirects[role], user: dbUser });
  } catch (error: any) {
    console.error("Google login post-auth error:", error);
    return NextResponse.json(
      { error: error?.message || "Unable to process Google login." },
      { status: 500 },
    );
  }
}