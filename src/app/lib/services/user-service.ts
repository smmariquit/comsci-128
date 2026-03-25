import { userData } from "@/data/user";
import { User } from "@/models/user";

type ServiceResponse<T> = { data?: T; error?: string };

const addUser = async (userDetails: any[], userType: string): Promise<User> => {
	try {
		// Check if email already exists
		const existing = await userData.findUserByEmail(userDetails[0]);
		if (existing) throw new Error("Email already in use.");

		// Check fields that are required
		if (!userDetails[0]) throw new Error("Email is required.");
		if (!userDetails[1]) throw new Error("First name is required.");
		if (!userDetails[3]) throw new Error("Last name is required.");
		if (!userDetails[8]) throw new Error("Password is required");
		if (!userType) throw new Error("User type is required.");

		// Insert user
		const created = await userData.createUser(userDetails, userType);
		return created;
	} catch (error) {
		console.error("Error: ", error);
		throw error;
	}
};

// getProfile - INPUT: userId | OUTPUT: user (if found), null/error (if not)
const getProfile = async (userId: Number): Promise<User | null> => {
	try {
		const userProfile = await userData.findUserById(userId);

		if (!userProfile) return null;

		return userProfile as unknown as User;
	} catch (error: any) {
		console.error("Error: ", error.message);
		throw new Error("Error");
	}
};

const getAllProfile = async (): Promise<User[] | null> => {
	try {
		const userProfiles = await userData.findAllUsers();

		if (!userProfiles) return [];

		return userProfiles;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

const updateProfile = async (
	userId: number,
	updates: any,
): Promise<ServiceResponse<User>> => {
	try {
		const { account_number, account_email, ...allowedUpdates } = updates;

		const updatedUser = await userData.updateUser(
			String(userId),
			allowedUpdates as any,
		);

		if (!updatedUser) {
			return { error: "User not found" };
		}

		return { data: updatedUser as unknown as User };
	} catch (error: any) {
		console.error("Error: ", error.message);
		throw new Error("Error");
	}
};

const deactivateUser = async (userId: Number): Promise<User | null> => {
	try {
		const user = await userData.deactivateUserById(userId);
		if (!user) return null;
		return user;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

export const userService = {
	addUser,
	getProfile,
	getAllProfile,
	updateProfile,
	deactivateUser,
};
