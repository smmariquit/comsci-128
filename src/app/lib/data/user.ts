import { User, NewUser, UpdateUser } from "@/models/user";
import { supabase } from "../supabase";

async function createUser(userDetails: NewUser): Promise<User> {
	// this is for returning the newly inserted user
	const { data, error } = await supabase
		.from("user")
		.insert(userDetails)
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
	// return data.account_number if PK
}

async function findAllUsers(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase.from("user").select();

	if (error) {
		throw new Error(error.message);
	}

	return data ?? null;
}

async function findUserById(userId: number): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("account_number", userId)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

async function findUserByEmail(userEmail: string): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("account_email", userEmail)
		.single();

	if (error) {
		return null;
	}

	return data;
}

async function updateUser(
	userId: string,
	userDetails: any[],
): Promise<User | null> {
	// update all attributes of the user based on their account number
	// RETURNS the updated object (user)

	const { data, error } = await supabase
		.from("user")
		.update(userDetails)
		.eq("account_number", Number(userId))
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data && data.length > 0 ? data[0] : null;
}

async function deactivateUserById(userId: number): Promise<User | null> {
	//This function takes a USERID of type STRING.
	// CHANGES is_deleted field to true if user is found, otherwise return null.

	const { data, error } = await supabase
		.from("user")
		.update({ is_deleted: true })
		.eq("account_number", userId)
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export const userData = {
	createUser,
	findAllUsers,
	findUserById,
	findUserByEmail,
	updateUser,
	deactivateUserById,
};
