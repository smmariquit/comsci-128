import bcrypt from "bcrypt";
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
    // Student default
    userDetails.user_type = "Student";
    // Hash pw
    const salt = await bcrypt.genSalt(12);
    userDetails.password = await bcrypt.hash(password, salt);

    // mock... replace once there's input for Student and StudentAcademic
    const studentDetails: NewStudent = {
      student_number: 0,
      housing_status: "Not Assigned",
      emergency_contact_name: "Maria Santos",
      emergency_contact_number: "09181234567",
      emergency_contact_relationship: "Mother",
    } as NewStudent;

    const studentAcademicDetails: NewStudentAcademic = {
      degree_program: "BS Computer Science",
      standing: "Freshman",
      status: "Active",
    };

    // Insert user
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

// getProfile - INPUT: userId | OUTPUT: user (if found), null/error (if not)
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
    // To consider: separate update on password for stronger security
    // e.g. email validation for changing password
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

const findOrCreateGoogleUser = async (googleUser: any): Promise<User> => {
  const email = googleUser.email;
  const googleId = googleUser.identities?.[0]?.id;

  const fullName = googleUser.user_metadata?.full_name || "";
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  const existingUser = await userData.findByEmail(email);

  if (existingUser) {
    return existingUser;
  }

  // create user
  const userDetails: NewUser = {
    account_email: email,
    contact_email: email,
    first_name: firstName,
    last_name: lastName,

    middle_name: null,
    birthday: null,
    home_address: null,
    phone_number: null,

    sex: "Prefer not to say",
    password: "", // No password for OAuth users
    user_type: "Student",
    google_identity: googleId,
    profile_picture: null,
    is_deleted: false,
  };

  const createdUser = await userData.create(userDetails);
  return createdUser;
};

export const userService = {
  addUser,
  getUser,
  getAllUser,
  updateUser,
  deactivateUser,
  getUserCount,
  getActiveUserCount,
  findOrCreateGoogleUser,
};
