import bcrypt from "bcrypt";
import { supabaseAdmin } from "../supabase";
import { studentData } from "@/app/lib/data/student-data";
import { userData } from "@/app/lib/data/user-data";
import type { NewStudent, Student } from "@/models/student";
import type { NewUser, UpdateUser, User } from "@/models/user";
import type { NewStudentAcademic } from "../models/student_academic";

type ServiceResponse<T> = { data?: T; error?: string };
type Public<T> = Omit<T, "account_number" | "password">;

const allowedSex = ["Female", "Male", "Prefer not to say"];

const addUser = async (userDetails: NewUser): Promise<Student> => {
	try {
		const { account_email, first_name, last_name, password } = userDetails;

		// required fields check
		if (!account_email) throw new Error("Email is required.");
		if (!first_name) throw new Error("First name is required.");
		if (!last_name) throw new Error("Last name is required.");
		if (!password) throw new Error("Password is required");

		// validate sex

		if (userDetails.sex && !allowedSex.includes(userDetails.sex)) {
			throw new Error(
				`Invalid sex value. Must be one of: ${allowedSex.join(", ")}`,
			);
		}

		// Check if email already exists
		const { data: existingUser } = await supabaseAdmin
			.from("user")
			.select("*")
			.eq("account_email", account_email)
			.single();
		if (existingUser) throw new Error("Email already in use.");

		// Hash pw
		const salt = await bcrypt.genSalt(12);
		const hashedPassword = await bcrypt.hash(password, salt);
		userDetails.password = hashedPassword;
		userDetails.user_type = "Student";
		userDetails.sex = userDetails.sex || "Prefer not to say";

		// create supabase auth user
		const { data: authData, error: authError } =
			await supabaseAdmin.auth.admin.createUser({
				email: account_email,
				password,
				email_confirm: true,
			});

		if (authError) {
			throw new Error(authError.message);
		}

		const user = authData.user;

		// Mock student record
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
		const createdUserStudent = await studentData.create(
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
			const { account_number, password, ...nonSensitiveInfo } =
				userDetails;
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
	userId: number,
): Promise<Public<UpdateUser> | null> => {
	try {
		const updatedUser = await userData.deactivate(userId);
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

export const userService = {
	addUser,
	getUser,
	getAllUser,
	updateUser,
	deactivateUser,
	getUserCount,
	getActiveUserCount,
};
