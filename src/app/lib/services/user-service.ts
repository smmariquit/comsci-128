import { findUserById, findUserByEmail, addUser } from "@/data/user";
import { User } from "@/models/user";

// getProfile - INPUT: userId | OUTPUT: user (if found), null/error (if not)
export const getProfile = async (userId: number): Promise<User | null> => {
	try {
		const userProfile = await findUserById(userId);

		if (!userProfile) return null;

		return userProfile;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

// createUser - INPUT: user data | OUTPUT: new user (if created), error (if not)
export const createUser = async (newUser: Omit<User, "account_number">): Promise<User> => {
	try {
		// Check if email already exists
		const existing = await findUserByEmail(newUser.account_email);
		if (existing) throw new Error("Email already in use.");

		// Check fields that are required
		if (!newUser.account_email) throw new Error("Email is required.");
		if (!newUser.first_name) throw new Error("First name is required.");
		if (!newUser.last_name) throw new Error("Last name is required.");
		if (!newUser.user_type) throw new Error("User type is required.");

		// Insert user
		const created = await addUser(newUser);
		return created;

	} catch (error) {
		console.error("Error: ", error);
		throw error;
	}
};