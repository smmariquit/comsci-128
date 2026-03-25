import { User, NewUser, UpdateUser } from "@/models/user";
import { supabase } from "../supabase";

export async function findUserById(userId: Number): Promise<User | null> {
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

export async function updateUser(
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

export async function findAllUsers(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase.from("user").select();

	if (error) {
		throw new Error(error.message);
	}

	return data ?? null;
}

export async function findUserByEmail(userEmail: string): Promise<User | null> {
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

export async function deactivateUserById(userId: Number): Promise<User | null> {
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

export async function createUser(
	userDetails: any[],
	userType: string,
): Promise<User> {
	// RETURNS the PK of the newly inserted USER

	// DO NOT DELETE (this is for returning the PK)
	// const { data, error } = await supabase
	// 	.from('user')
	// 	.insert([{
	// 		account_email: userDetails[0],
	// 		first_name: userDetails[1],
	// 		middle_name: userDetails[2] ?? null, // unless null can be passed
	// 		last_name: userDetails[3],
	// 		birthday: userDetails[4] ?? null,
	// 		home_address: userDetails[5] ?? null,
	// 		phone_number: userDetails[6] ?? null,
	// 		contact_email: userDetails[7] ?? null,
	// 		sex: userDetails[8],
	// 		userType: userType,
	// 		is_deleted: false
	// 	}])
	// 	.select('account_number')
	// 	.single();

	// this is for returning the newly inserted user
	const { data, error } = await supabase
		.from("user")
		.insert([
			{
				account_email: userDetails[0],
				first_name: userDetails[1],
				middle_name: userDetails[2] ?? null, // unless null can be passed
				last_name: userDetails[3],
				birthday: userDetails[4] ?? null,
				home_address: userDetails[5] ?? null,
				phone_number: userDetails[6] ?? null,
				contact_email: userDetails[7] ?? null,
				user_type: userType,
				is_deleted: false,
				password: userDetails[8],
			},
		])
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
	// return data.account_number if PK
}
