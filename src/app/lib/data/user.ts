import { Database, Tables, Enums } from "../../types/database.types";
import { supabase } from "../supabase";

export type User = Tables<'user'>;

//This serves as the mock 'Database' to test functions
// const MOCK_USERS: User[] = [
// 	{
// 		account_number: 1,
// 		account_email: "mahoraga@mappa.com",
// 		first_name: "Mahoraga",
// 		last_name: "Shikigami",
// 		home_address: "Shibuya, Tokyo, Japan",
// 		phone_number: "+81-90-0000-0001",
// 		user_type: "Student",
// 		is_deleted: false,
// 	},
// 	{
// 		account_number: 2,
// 		account_email: "johnkaisen@mappa.com",
// 		first_name: "John",
// 		last_name: "Kaisen",
// 		home_address: "Shinjuku, Tokyo, Japan",
// 		phone_number: "+81-90-0000-0002",
// 		contact_email: "john.personal@example.com",
// 		user_type: "Student",
// 		is_deleted: false,
// 	},
// 	{
// 		account_number: 3,
// 		account_email: "susangrotto@mgmail.com",
// 		first_name: "Susan",
// 		last_name: "Grotto",
// 		home_address: "Kyoto, Japan",
// 		phone_number: "+81-90-0000-0003",
// 		sex: "Female",
// 		user_type: "Manager",
// 		is_deleted: false,
// 	},
// 	{
// 		account_number: 4,
// 		account_email: "alfredbuttler@wayne.com",
// 		first_name: "Bruce",
// 		middle_name: "Thomas",
// 		last_name: "Wayne",
// 		home_address: "Gotham City",
// 		phone_number: "+1-202-555-0104",
// 		birthday: new Date("1985-02-19"),
// 		user_type: "Manager",
// 		is_deleted: false,
// 	},
// 	{
// 		account_number: 5,
// 		account_email: "allancruz@gov.ph",
// 		first_name: "Allan",
// 		last_name: "Cruz",
// 		home_address: "Quezon City, Philippines",
// 		phone_number: "+63-917-000-0005",
// 		sex: "Male",
// 		user_type: "Manager",
// 		is_deleted: false,
// 	},
// ];

export async function findUserById(userId: Number): Promise<User | null> {

    const { data, error } = await supabase
        .from('user')
        .select()
        .eq('account_number', userId)
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
		return null;
	}

	return data;
}

export async function createUser(userDetails: any[], userType: string): Promise<User> {
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
		.from('user')
		.insert([{ 
			account_email: userDetails[0],
			first_name: userDetails[1],
			middle_name: userDetails[2] ?? null, // unless null can be passed
			last_name: userDetails[3],
			birthday: userDetails[4] ?? null,
			home_address: userDetails[5] ?? null,
			phone_number: userDetails[6] ?? null,
			contact_email: userDetails[7] ?? null,
			sex: userDetails[8],
			userType: userType,
			is_deleted: false
		}])
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
	// return data.account_number if PK
}