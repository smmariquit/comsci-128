import bcrypt from "bcrypt";
import { studentData } from "@/app/lib/data/student-data";
import { userData } from "@/app/lib/data/user-data";
import type { NewStudent, Student } from "@/models/student";
import type { NewUser, UpdateUser, User } from "@/models/user";
import type { NewStudentAcademic } from "../models/student_academic";

type ServiceResponse<T> = { data?: T; error?: string };
type Public<T> = Omit<T, "account_number" | "password">;

const addUser = async (userDetails: NewUser): Promise<Student> => {
  try {
    const { account_email, first_name, last_name, password } = userDetails;

    // Check if email already exists
    const existing = await userData.findUserByEmail(account_email);
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

    // mock... replace once there's input for Student
    const studentDetails: NewStudent = {
      student_number: Math.floor(100000 + Math.random() * 900000),
      housing_status: "Not Assigned",
      emergency_contact_name: null,
      emergency_contact_number: null,
      emergency_contact_relationship: null,
    };

    // mock... replace once there's input for StudentAcademic
    const studentAcademicDetails: NewStudentAcademic = {
      degree_program: "BS Computer Science",
      standing: "Sophomore",
      status: "Active",
    };

    // Insert user
    // const createdUser = await userData.createUser(userDetails);
    const createdUserStudent = await studentData.createUserStudent(
      userDetails,
      studentDetails,
      studentAcademicDetails,
    );

    return createdUserStudent;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

// getProfile - INPUT: userId | OUTPUT: user (if found), null/error (if not)
const getUser = async (userId: number): Promise<Public<User> | null> => {
  try {
    const userProfile = await userData.findUserById(userId);

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
    const userProfiles = await userData.findAllUsers();

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

    const updatedUser = await userData.updateUser(userId, allowedUpdates);

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
  userId: number,
): Promise<Public<UpdateUser> | null> => {
  try {
    const updatedUser = await userData.deactivateUserById(userId);
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

export const userService = {
  addUser,
  getUser,
  getAllUser,
  updateUser,
  deactivateUser,
};
