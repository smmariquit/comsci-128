import { User, NewUser, UpdateUser } from "@/models/user";
import { supabase } from "../supabase";

async function create(userDetails: NewUser): Promise<User> {
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

async function findAll(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("is_deleted", false);

	if (error) throw new Error(`Get All Users Error: ${error.message}`);

	return data ?? null;
}

async function findById(userId: number): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("account_number", userId)
		.eq("is_deleted", false);

	if (error) throw new Error(`Find User by ID Error: ${error.message}`);

	return data && data.length > 0 ? data[0] : null;
}

async function findByEmail(userEmail: string): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("account_email", userEmail)
		.eq("is_deleted", false);

	if (error) throw new Error(`Find User by Email Error: ${error.message}`);

	return data && data.length > 0 ? data[0] : null;
}

async function update(
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

async function deactivate(userId: number): Promise<UpdateUser | null> {
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

export const userData = {
	create,
	findAll,
	findById,
	findByEmail,
	update,
	deactivate,
};