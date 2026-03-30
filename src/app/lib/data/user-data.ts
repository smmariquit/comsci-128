import { User, NewUser, UpdateUser } from "@/models/user";
import { supabase } from "../supabase";

async function create(userDetails: NewUser): Promise<User> {
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

async function findAll(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase.from("user").select();

	if (error) {
		throw new Error(error.message);
	}

	return data ?? null;
}

async function findById(userId: number): Promise<User | null> {
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

async function findByEmail(userEmail: string): Promise<User | null> {
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

	if (error) {
		throw new Error(error.message);
	}

	return data && data.length > 0 ? data[0] : null;
}

async function deactivateById(userId: number): Promise<UpdateUser | null> {
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

async function findStudent(): Promise<User[]> {
	// returns students ONLY
	const { data, error } = await supabase
	.from("user")
	.select()
	.eq("role", "Student")
	.eq("is_deleted", false);

	if (error) {
		throw new Error(error.message);
	}

	return data ?? null;
}

export const userData = {
	create,
	findAll,
	findById,
	findByEmail,
	update,
	deactivateById,
};
