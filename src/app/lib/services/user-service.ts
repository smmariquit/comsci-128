import { findUserById, findAllUsers, User, deactivateUserById } from "@/data/user";

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

export const getAllProfile = async (): Promise<User[] | null> => {
	try {
		const userProfiles = await findAllUsers();

		if (!userProfiles) return [];

		return userProfiles;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

export const deactivateUser = async (userId: Number): Promise<User | null> => {

	try {
		const user = await deactivateUserById(userId)
		if (!user) return null
		return user 
	} catch (error) {

		console.error("Error: ", error)
		throw new Error("Error")
	}
}