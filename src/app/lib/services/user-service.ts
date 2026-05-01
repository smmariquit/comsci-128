import "server-only";

import { supabaseAdmin } from "@/app/lib/supabase-admin";
import { studentData } from "@/app/lib/data/student-data";
import { userData } from "@/app/lib/data/user-data";
import type { NewStudent } from "@/models/student";
import type { NewUser, UpdateUser, User } from "@/models/user";
import type { Role } from "../models/audit_log";
import { AppAction } from "../models/permissions";
import type { NewStudentAcademic } from "../models/student_academic";
import { validateAction } from "./authorization-service";

type ServiceResponse<T> = { data?: T; error?: string };
type Public<T> = Omit<T, "account_number" | "password">;

const _allowedSex = ["Female", "Male", "Prefer not to say"];

type GoogleProfile = {
  email: string;
  googleIdentity: string | null;
  firstName: string;
  lastName: string;
};

function normalizeGoogleProfile(googleUser: any): GoogleProfile {
  const email = googleUser.email || googleUser.user_metadata?.email || "";
  const googleIdentity = googleUser.identities?.[0]?.id || null;
  const fullName =
    googleUser.user_metadata?.full_name ||
    googleUser.user_metadata?.name ||
    "";
  const nameParts = fullName.trim().split(/\s+/).filter(Boolean);
  const firstName = nameParts[0] || email.split("@")[0] || "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : firstName;

  return { email, googleIdentity, firstName, lastName };
}

const addUser = async (userDetails: NewUser): Promise<User> => {
  try {
    const { account_email, first_name, last_name, password } = userDetails;

    // Check if email already exists
    const existing = await userData.findByEmail(account_email);
    if (existing) throw new Error("Email already in use.");

    // Check fields that are required
    if (!account_email) throw new Error("Email is required.");
    if (!first_name) throw new Error("First name is required.");
    if (!last_name) throw new Error("Last name is required.");
    if (!password) throw new Error("Password is required");

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: account_email,
      password: password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      throw new Error(`Auth creation failed: ${authError?.message || "Unknown error"}`);
    }

    // set user type to Student (default)
    userDetails.user_type = "Student";
    userDetails.password = "";

    // create student details
    // update when student_academic table is non-nullable
    const studentDetails: NewStudent = {
      student_number: Math.floor(Math.random() * 1000000),
      housing_status: "Not Assigned",
      emergency_contact_name: null,
      emergency_contact_number: null,
      emergency_contact_relationship: null,
    } as NewStudent;

    // updated by student later
    const studentAcademicDetails: NewStudentAcademic = {
      degree_program: "",
      standing: undefined,
      status: "Active",
    };

    const createdUser = await userData.create(userDetails);

    await studentData.create(
      createdUser.account_number,
      studentDetails,
      studentAcademicDetails,
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

    const { account_number, password, ...nonSensitiveInfo } = userProfile;

    return nonSensitiveInfo;
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
      const { account_number, password, ...nonSensitiveInfo } = userDetails;
      publicInfos.push(nonSensitiveInfo);
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

    const {
      account_number: _,
      password: __,
      ...nonSensitiveInfo
    } = updatedUser;
    return { data: nonSensitiveInfo };
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

    // TODO: reevaluate returning data for disable or not
    // Currently returns data
    const { account_number, password, ...nonSensitiveInfo } = updatedUser;
    return nonSensitiveInfo;
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
    const byGoogleIdentity = await userData.findByGoogleIdentity(profile.googleIdentity);
    if (byGoogleIdentity) {
      return byGoogleIdentity;
    }
  }

  if (!profile.email) {
    return null;
  }

  return await userData.findByEmail(profile.email);
};

const createGooglePlaceholderUser = async (googleUser: any): Promise<User> => {
  const profile = normalizeGoogleProfile(googleUser);

  const userDetails: NewUser = {
    account_email: profile.email,
    contact_email: null,
    first_name: profile.firstName,
    last_name: profile.lastName,
    middle_name: null,
    birthday: null,
    home_address: null,
    phone_number: null,
    sex: "Prefer not to say",
    password: "",
    user_type: "Student",
    google_identity: profile.googleIdentity,
    profile_picture: null,
    is_deleted: false,
  };

  return await userData.create(userDetails);
};

const finalizeGoogleSignup = async (accountEmail: string, updates: NewUser): Promise<User> => {
  const existingUser = await userData.findByEmail(accountEmail);

  if (!existingUser) {
    throw new Error("Google account not found.");
  }

  const updatedUser = await userData.update(existingUser.account_number, {
    first_name: updates.first_name,
    middle_name: updates.middle_name || null,
    last_name: updates.last_name,
    birthday: updates.birthday || null,
    home_address: updates.home_address || null,
    phone_number: updates.phone_number || null,
    contact_email: updates.contact_email || accountEmail,
    sex: updates.sex || "Prefer not to say",
    password: existingUser.password || "",
    user_type: existingUser.user_type,
    google_identity: existingUser.google_identity,
    profile_picture: existingUser.profile_picture,
    is_deleted: existingUser.is_deleted,
    account_email: existingUser.account_email,
  });

  if (!updatedUser) {
    throw new Error("Failed to finalize Google signup.");
  }

  return updatedUser as User;
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
  createGooglePlaceholderUser,
  finalizeGoogleSignup,
};
