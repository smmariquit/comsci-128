import { User, NewUser, UpdateUser } from "@/models/user";
import { supabase } from "../supabase";
import { count } from "console";

async function createUser(userDetails: NewUser): Promise<User> {
	// this is for returning the newly inserted user
	const { data, error } = await supabase
		.from("user")
		.insert(userDetails)
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data[0];
}

async function findAllUsers(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase
<<<<<<< HEAD
	.from('user')
	.select()
	.eq('is_deleted', false);
=======
		.from("user")
		.select()
		.eq("is_deleted", false);
>>>>>>> f10af6eae1b2b5596c18f711f6be0f4758a24f38

	if (error) throw new Error(`Get All Users Error: ${error.message}`);

	return data ?? [];
}

<<<<<<< HEAD

async function findById(userId: number): Promise<User | null> {
=======
async function findUserById(userId: number): Promise<User | null> {
>>>>>>> f10af6eae1b2b5596c18f711f6be0f4758a24f38
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("account_number", userId)
		.eq("is_deleted", false);

	if (error) throw new Error(`Find User by ID Error: ${error.message}`);

	return data && data.length > 0 ? data[0] : null;
}

async function findUserByEmail(userEmail: string): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("account_email", userEmail)
		.eq("is_deleted", false);

	if (error) throw new Error(`Find User by Email Error: ${error.message}`);

	return data && data.length > 0 ? data[0] : null;
}

async function updateUser(
	userId: number,
	userDetails: UpdateUser,
): Promise<UpdateUser | null> {
	// update all attributes of the user based on their account number
	// RETURNS the updated object (user)

	const { data, error } = await supabase
		.from("user")
		.update(userDetails)
		.eq("account_number", Number(userId))
		.select();

	if (error) throw new Error(`Update User Error: ${error.message}`);

	return data && data.length > 0 ? data[0] : null;
}

async function deactivateUserById(userId: number): Promise<UpdateUser | null> {
	// This function takes a USERID of type STRING.
	// CHANGES is_deleted field to true if user is found, otherwise return null.

	const { data, error } = await supabase
		.from("user")
		.update({ is_deleted: true })
		.eq("account_number", userId)
		.select();

	if (error) throw new Error(`Deactivate User Error: ${error.message}`);

	return data && data.length > 0 ? data[0] : null;
}

async function countAllUser(): Promise<number | null> {
	const { count, error } = await supabase
		.from("user")
		.select("*", { count: "exact", head: true });

	if (error) throw new Error(error.message);

	return count;
}

// Counts only active users (not marked as deleted)
async function countActiveUsers():Promise<number | null> {
	const { count, error } = await supabase
      .from("user")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false);

	if (error) throw new Error(error.message);

	return count;
}

export const userData = {
	createUser,
	findAllUsers,
<<<<<<< HEAD
	findById,
	findByEmail,
	update,
	deactivateById,
	countAllUser,
	countActiveUsers
};
=======
	findUserById,
	findUserByEmail,
	updateUser,
	deactivateUserById,
};
>>>>>>> f10af6eae1b2b5596c18f711f6be0f4758a24f38
