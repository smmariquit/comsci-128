import bcrypt from "bcrypt";
import { userData } from "@/data/user";
import { User, NewUser } from "@/models/user";

type ServiceResponse<T> = { data?: T; error?: string };
type PublicUser = Omit<User, "account_number" | "password">;

const addUser = async (userDetails: NewUser): Promise<User> => {
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

		// Insert user
		const createdUser = await userData.createUser(userDetails);
		return createdUser;
	} catch (error) {
		console.error("Error: ", error);
		throw error;
	}
};

// getProfile - INPUT: userId | OUTPUT: user (if found), null/error (if not)
const getProfile = async (userId: Number): Promise<PublicUser | null> => {
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

const getAllProfile = async (): Promise<PublicUser[] | null> => {
	try {
		const userProfiles = await userData.findAllUsers();

		if (!userProfiles) return [];

		const publicInfos: PublicUser[] = [];
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
