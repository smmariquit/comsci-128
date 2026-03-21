import { Tables, TablesInsert, TablesUpdate } from "@/app/types/database.types";
import { supabase } from "../supabase";

export type User = Tables<"user">;
export type NewUser = TablesInsert<"user">;
export type UpdateUser = TablesUpdate<"user">;

export async function updateUser(userId: string, userDetails: any[]): Promise<User | null> {
	// update all attributes of the user based on their account number
	// RETURNS the updated object (user)

	const { data, error } = await supabase
		.from('user')
		.update(userDetails)
		.eq('account_number', Number(userId))
		.select()

	if (error) {
		throw new Error(error.message);
	}

	return data && data.length > 0 ? data[0] : null;
}

export async function findAllUsers(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase.from("user").select();

	if (error) {
		throw new Error(error.message);
	}

	return data ?? null;
}

export async function findUserById(userId: Number): Promise<User | null> {
	//This function takes a USERID of type STRING.
	// RETURNS a USER object when found in the DB, otherwise return null.

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

export async function findUserByEmail(userEmail: string): Promise<User | null> {
	const { data, error } = await supabase
		.from('user')
		.select()
		.eq('account_email', userEmail)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}