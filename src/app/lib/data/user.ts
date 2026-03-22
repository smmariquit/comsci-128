import { User } from "@/models/user";
import { supabase } from "../supabase";

export async function createUser(userDetails: User, userType: string, userPassword: string): Promise<number | null> {
	// RETURNS the PK of the newly inserted user

	const { data, error } = await supabase
		.from('user')
		.insert({ 
			account_email: userDetails.accountEmail,
			password: userPassword,
			first_name: userDetails.firstName,
			middle_name: userDetails.middleName ?? null,
			last_name: userDetails.lastName,
			birthday: userDetails.birthday ?? null,
			home_address: userDetails.permAddress ?? null,
			phone_number: userDetails.contactNumber ?? null,
			contact_email: userDetails.contactEmail ?? null,
			sex: userDetails.sex ?? null,
			userType: userType,
			is_deleted: false
		})
		.select('account_number');

	if (error) {
		throw new Error(error.message);
	}

	return data && data.length > 0 ? data[0].account_number : null;
}

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

export async function deactivateUser(userId: string): Promise<User | null> {
	// soft delete a user based on their user ID
	// returns the user

	const { data, error } = await supabase
		.from('user')
		.update({ is_deleted: true })
		.eq('account_number', Number(userId))
		.select();

	if (error) {
		throw new Error(error.message);
	}

	return data && data.length > 0 ? data[0] : null;
}

export async function getAllUsers(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase
	.from('user')
	.select()
	.eq('is_deleted', false);

	if (error) {
		throw new Error(error.message);
	}

	return data ?? [];
}

export async function findUserById(userId: string): Promise<User | null> {
	//This function takes a USERID of type STRING.
	// RETURNS a USER object when found in the DB, otherwise return null.

	const { data, error } = await supabase
		.from('user')
		.select()
		.eq('account_number', Number(userId));

	if (error) {
		throw new Error(error.message);
	}

	return data && data.length > 0 ? data[0] : null;
}

export async function findUserByEmail(userEmail: string): Promise<User | null> {
	const { data, error } = await supabase
		.from('user')
		.select()
		.eq('account_email', userEmail);

	if (error) {
		throw new Error(error.message);
	}

	return data && data.length > 0 ? data[0] : null;
}