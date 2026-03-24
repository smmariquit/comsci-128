import { findUserById, findAllUsers, User, updateUser } from "@/data/user";

// getProfile - INPUT: userId | OUTPUT: user (if found), null/error (if not)
export const getProfile = async (userId: Number): Promise<User | null> => {
	try {
		const userProfile = await findUserById(userId);

		if (!userProfile) return null;

		return userProfile as unknown as User;
	} catch (error: any) {
		console.error("Error: ", error.message);
		throw new Error("Error");
	}
};


type ServiceResponse<T> = { data?: T; error?: string };

export const updateProfile = async (userId: number, updates: any): Promise<ServiceResponse<User>> => {
	try {
		const {
			account_number,
			account_email,
			...allowedUpdates
		} = updates;

		const updatedUser = await updateUser(String(userId), allowedUpdates as any);
		
		if (!updatedUser) {
			return { error: "User not found" };
		}

		return { data: updatedUser as unknown as User };

	} catch (error: any) {
		console.error("Error: ", error.message);
		throw new Error("Error");
	}
}

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
