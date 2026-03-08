import { findUserById } from "@/data/user";
import { User } from "@/models/user";

// getProfile - INPUT: userId | OUTPUT: user (if found), null/error (if not)
export const getProfile = async (userId: string): Promise<User | null> => {
	try {
		const userProfile = await findUserById(userId);

		if (!userProfile) return null;

		return userProfile;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};
