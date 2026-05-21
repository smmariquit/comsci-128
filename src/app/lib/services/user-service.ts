import "server-only";

import { supabaseAdmin } from "@/app/lib/supabase-admin";
import { studentData } from "@/app/lib/data/student-data";
import { userData } from "@/app/lib/data/user-data";
import type { NewUser, UpdateUser, User } from "@/models/user";
import type { Role } from "../models/audit_log";
import { AppAction } from "../models/permissions";
import { validateAction } from "./authorization-service";
import { createAuditLog } from "./audit-log-service";

type ServiceResponse<T> = { data?: T; error?: string };
type Public<T> = Omit<T, "password">;

const _allowedSex = ["Female", "Male", "Prefer not to say"];

type GoogleProfile = {
  email: string;
  googleIdentity: string | null;
  firstName: string;
  lastName: string;
};

function formatUserName(user: {
  first_name?: string | null;
  last_name?: string | null;
  account_email?: string | null;
}): string {
  const first = user.first_name?.trim() ?? "";
  const last = user.last_name?.trim() ?? "";
  const full = `${first} ${last}`.trim();
  return full || user.account_email?.trim() || "";
}

function normalizeGoogleProfile(googleUser: any): GoogleProfile {
  const email = googleUser.email || googleUser.user_metadata?.email || "";
  const googleIdentity = googleUser.identities?.[0]?.id || null;
  const fullName =
    googleUser.user_metadata?.full_name || googleUser.user_metadata?.name || "";
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || email.split("@")[0] || "";
  const lastName =
    nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName;

  return { email, googleIdentity, firstName, lastName };
}

type AddUserOptions = {
  authUserAlreadyCreated?: boolean;
};

const addUser = async (
  userDetails: NewUser,
  options: AddUserOptions = {},
): Promise<User> => {
  try {
    const { account_email, first_name, last_name } = userDetails;

    // Check if email already exists
    const existing = await userData.findByEmail(account_email);
    if (existing) throw new Error("Email already in use.");

    // Check fields that are required
    if (!account_email) throw new Error("Email is required.");
    if (!first_name) throw new Error("First name is required.");
    if (!last_name) throw new Error("Last name is required.");

    if (options.authUserAlreadyCreated) {
      // The client already called supabase.auth.signUp(), so the auth user
      // should exist. Verify that before creating the profile row.
      const { data: authUsers, error: listError } =
        await supabaseAdmin.auth.admin.listUsers({
          page: 1,
          perPage: 1000,
        });

      if (listError) {
        throw new Error(`Auth lookup failed: ${listError.message}`);
      }

      const authUserExists = authUsers.users.some(
        (user) => user.email?.toLowerCase() === account_email.toLowerCase(),
      );

      if (!authUserExists) {
        throw new Error("Email confirmation must be started before signup.");
      }
    }

    // Passwords are managed exclusively by Supabase Auth (auth.users).
    // Never store passwords in the public user table.
    userDetails.user_type = "Student";
    userDetails.password = null;

    const createdUser = await userData.create(userDetails);

    const userName = formatUserName(createdUser);
    const label = userName || createdUser.account_email || "Unknown user";
    await createAuditLog(
      createdUser.account_number,
      userName,
      "Auth Register",
      `User ${label} registered`,
    );

    return createdUser;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const getUser = async (userId: number): Promise<Public<User> | null> => {
  try {
    const userProfile = await userData.findById(userId);

    if (!userProfile) return null;

    const { password, ...publicInfo } = userProfile;

    return publicInfo;
  } catch (error: any) {
    console.error("Error: ", error.message);
    throw new Error("Error");
  }
};

const getAllUser = async (): Promise<Public<User>[] | null> => {
  try {
    const userProfiles = await userData.findAll();

    if (!userProfiles) return [];

    const publicInfos: Public<User>[] = [];
    userProfiles.forEach((userDetails) => {
      const { password, ...publicInfo } = userDetails;
      publicInfos.push(publicInfo);
    });
    return publicInfos;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Error");
  }
};

const updateUser = async (
  userId: number,
  updates: NewUser,
): Promise<ServiceResponse<Public<UpdateUser>>> => {
  try {
    const { account_number, account_email, is_deleted, ...allowedUpdates } =
      updates;

    const updatedUser = await userData.update(userId, allowedUpdates);

    if (!updatedUser) {
      return { error: "User not found" };
    }

    const userName = formatUserName(updatedUser);
    const label = userName || updatedUser.account_email || "Unknown user";
    await createAuditLog(
      updatedUser.account_number!,
      userName,
      "Update User Details",
      `User ${label} updated details`,
    );

    const { password: __, ...publicInfo } = updatedUser;
    return { data: publicInfo };
  } catch (error: any) {
    console.error("Error: ", error.message);
    throw new Error("Error");
  }
};

const deactivateUser = async (
  email: string,
): Promise<Public<UpdateUser> | null> => {
  try {
    // RBAC
    await validateAction(AppAction.DELETE_ACCOUNT);

    const updatedUser = await userData.deactivate(email);
    if (!updatedUser) return null;

    const { password, ...publicInfo } = updatedUser;

    const userName = formatUserName(updatedUser);
    const label = userName || updatedUser.account_email || "Unknown user";
    await createAuditLog(
      updatedUser.account_number!,
      userName,
      "Delete Account",
      `User ${label} deactivated`,
    );

    return publicInfo;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Error");
  }
};

const getUserCount = async (): Promise<number | null> => {
  try {
    const userCount = await userData.countAllUser();
    if (!userCount) return null;

    return userCount;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Error");
  }
};

const getActiveUserCount = async (): Promise<number | null> => {
  try {
    const userCount = await userData.countActiveUsers();
    if (!userCount) return null;

    return userCount;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Error");
  }
};

const _promoteUserType = async (
  account_email: string,
  userType: Role,
  _insertTable: string,
): Promise<ServiceResponse<any>> => {
  try {
    const updatedUser = await userData.promote(account_email, {
      user_type: userType,
    });

    if (!updatedUser) {
      return { error: "User not found" };
    }

    const userName = formatUserName(updatedUser);
    const label = userName || updatedUser.account_email || "Unknown user";
    await createAuditLog(
      updatedUser.account_number!,
      userName,
      "Update User Role",
      `User ${label} role updated to ${userType}`,
    );

    // Insert in the table of the current role
    if (userType === "Student") {
    }

    if (userType === "Manager") {
    }

    const { account_number, password, ...safeUser } = updatedUser;

    return { data: safeUser };
  } catch (error: any) {
    console.error("Error:", error.message);
    return { error: "Failed to update user type" };
  }
};

const findGoogleUser = async (googleUser: any): Promise<User | null> => {
  const profile = normalizeGoogleProfile(googleUser);

  if (profile.googleIdentity) {
    const byGoogleIdentity = await userData.findByGoogleIdentity(
      profile.googleIdentity,
    );
    if (byGoogleIdentity) {
      return byGoogleIdentity;
    }
  }

  if (!profile.email) {
    return null;
  }

  return await userData.findByEmail(profile.email);
};

const finalizeGoogleSignup = async (
  googleUser: any,
  updates: UpdateUser,
): Promise<User> => {
  const profile = normalizeGoogleProfile(googleUser);
  const accountEmail = updates.account_email || profile.email;

  if (!accountEmail) {
    throw new Error("Email is required.");
  }

  const existingUser = await userData.findByEmail(accountEmail);
  if (existingUser) {
    throw new Error("Email already in use.");
  }

  if (!updates.first_name) throw new Error("First name is required.");
  if (!updates.last_name) throw new Error("Last name is required.");

  let authUserId = googleUser?.id as string | undefined;
  if (!authUserId) {
    const { data: authUsers, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      throw new Error(`Failed to list Auth users: ${listError.message}`);
    }

    const authUser = authUsers?.users?.find((u) => u.email === accountEmail);
    if (!authUser) {
      throw new Error("Auth user not found.");
    }
    authUserId = authUser.id;
  }

  // If the user provided a password during Google signup, set it in Auth
  // so they can also log in with email+password later.
  if (updates.password) {
    const { error: updateError } =
      await supabaseAdmin.auth.admin.updateUserById(authUserId, {
        password: updates.password,
        email_confirm: true,
      });

    if (updateError) {
      throw new Error(`Auth update failed: ${updateError.message}`);
    }
  } else {
    // At minimum confirm the email for Google users
    await supabaseAdmin.auth.admin.updateUserById(authUserId, {
      email_confirm: true,
    });
  }

  // Passwords are managed exclusively by Supabase Auth.
  // Never store passwords in the public user table.
  const userDetails: NewUser = {
    account_email: accountEmail,
    contact_email: updates.contact_email ?? null,
    first_name: updates.first_name,
    last_name: updates.last_name,
    middle_name: updates.middle_name ?? null,
    birthday: updates.birthday ?? null,
    home_address: updates.home_address ?? null,
    phone_number: updates.phone_number ?? null,
    sex: updates.sex ?? "Prefer not to say",
    password: null,
    user_type: "Student",
    google_identity: profile.googleIdentity,
    profile_picture: updates.profile_picture ?? null,
    is_deleted: false,
  };

  const createdUser = await userData.create(userDetails);
  const userName = formatUserName(createdUser);
  const label = userName || createdUser.account_email || "Unknown user";
  await createAuditLog(
    createdUser.account_number,
    userName,
    "Auth Register",
    `User ${label} registered via Google`,
  );
  return createdUser;
};

const deleteGooglePlaceholderUser = async (
  email: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const existingUser = await userData.findByEmail(email);

    if (existingUser) {
      await studentData.deleteByAccountNumber(existingUser.account_number);
    }

    const userDeleteResult = await userData.deleteByEmail(email);

    if (!userDeleteResult.deleted) {
      return {
        success: false,
        error: `Database cleanup failed: ${userDeleteResult.error}`,
      };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const deleteFromSupabaseAuth = async (
  email: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: authUsers, error: listError } =
      await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      return {
        success: false,
        error: `Failed to list Auth users: ${listError.message}`,
      };
    }

    const authUser = authUsers?.users?.find((u) => u.email === email);

    if (!authUser) {
      return { success: true };
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
      authUser.id,
    );

    if (deleteError) {
      return {
        success: false,
        error: `Failed to delete from Auth: ${deleteError.message}`,
      };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

const cleanupGooglePlaceholder = async (
  email: string,
): Promise<{ success: boolean; dbError?: string; authError?: string }> => {
  const dbCleanup = await deleteGooglePlaceholderUser(email);

  const authCleanup = await deleteFromSupabaseAuth(email);

  const result = {
    success: dbCleanup.success && authCleanup.success,
    ...(dbCleanup.error && { dbError: dbCleanup.error }),
    ...(authCleanup.error && { authError: authCleanup.error }),
  };

  return result;
};

export const userService = {
  addUser,
  getUser,
  getAllUser,
  updateUser,
  deactivateUser,
  getUserCount,
  getActiveUserCount,
  findGoogleUser,
  finalizeGoogleSignup,
  cleanupGooglePlaceholder,
};
