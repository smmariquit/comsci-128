import bcrypt from "bcrypt";
import { userData } from "@/app/lib/data/user-data";
import { User, NewUser, UpdateUser } from "@/models/user";

type ServiceResponse<T> = { data?: T; error?: string };
type Public<T> = Omit<T, "account_number" | "password">;

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
		// Default to Student if not specified
		if (!userDetails.user_type) {
		userDetails.user_type = "Student";
		}
		// Hash pw
		const salt = await bcrypt.genSalt(12);
		userDetails.password = await bcrypt.hash(password, salt);

		// Insert user
		const createdUser = await userData.createUser(userDetails);
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
		const updatedUser = await userData.deactivateById(userId);
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
