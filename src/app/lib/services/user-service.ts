import { Tables } from "../../types/database.types";
import { findUserById, findUserByEmail, createUser, User} from "@/data/user";

// getProfile - INPUT: userId | OUTPUT: user (if found), null/error (if not)
export const getProfile = async (userId: Number): Promise<User | null> => {
	try {
		const userProfile = await findUserById(userId);

		if (!userProfile) return null;

		return userProfile;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

export const addUser = async (userDetails: any[], userType: string): Promise<User> => {
	try {
		// Check if email already exists
		const existing = await findUserByEmail(userDetails[0]);
		if (existing) throw new Error("Email already in use.");

		// Check fields that are required
		if (!userDetails[0]) throw new Error("Email is required.");
		if (!userDetails[1]) throw new Error("First name is required.");
		if (!userDetails[3]) throw new Error("Last name is required.");
		if (!userType) throw new Error("User type is required.");

		// Insert user
		const created = await createUser(userDetails, userType);
		return created;

	} catch (error) {
		console.error("Error: ", error);
		throw error;
	}
};