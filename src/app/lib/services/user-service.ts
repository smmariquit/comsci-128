import { findUserById, updateUser } from "@/data/user";
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

export const updateProfile = async (userId: number, updates: any): Promise<ServiceResponse<User>> => {
	try {
		const {
			account_number,
			account_email,
			...allowedUpdates
		} = updates;

		const updateArray = [allowedUpdates];

		const updatedUser = await updateUser(String(userId), updateArray);

		return { data: updatedUser as unknown as User };

	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
}