import { Database, Tables, Enums } from "../../types/database.types";
import { supabase } from "../supabase";

type User = Tables<'user'>;

//This serves as the mock 'Database' to test functions
// const MOCK_USERS: User[] = [
// 	{
// 		userId: "1",
// 		email: "nahidadapt@mappa.com",

// 		firstName: "Mahoraga",
// 		lastName: "Shikigami",
// 		permAddress: "Shibuya, Tokyo, Japan",
// 		contactNumber: "+81-90-0000-0001",

// 		role: "Student",
// 		status: "Active",
// 	},
// 	{
// 		userId: "2",
// 		email: "johnkaisen@mappa.com",

// 		firstName: "John",
// 		lastName: "Kaisen",
// 		permAddress: "Shinjuku, Tokyo, Japan",
// 		contactNumber: "+81-90-0000-0002",
// 		contactEmail: "john.personal@example.com",

// 		role: "Student",
// 		status: "Inactive",
// 	},
// 	{
// 		userId: "3",
// 		email: "susangrotto@mgmail.com",

// 		firstName: "Susan",
// 		lastName: "Grotto",
// 		permAddress: "Kyoto, Japan",
// 		contactNumber: "+81-90-0000-0003",
// 		sex: "Female",

// 		role: "Landlord",
// 		status: "Active",
// 	},
// 	{
// 		userId: "4",
// 		email: "alfredbuttler@wayne.com",

// 		firstName: "Bruce",
// 		middleName: "Thomas",
// 		lastName: "Wayne",
// 		permAddress: "Gotham City",
// 		contactNumber: "+1-202-555-0104",
// 		birthday: new Date("1985-02-19"),
// 		age: 40,

// 		role: "Housing Administrator",
// 		status: "Active",
// 	},
// 	{
// 		userId: "5",
// 		email: "allancruz@gov.ph",

// 		firstName: "Allan",
// 		lastName: "Cruz",
// 		permAddress: "Quezon City, Philippines",
// 		contactNumber: "+63-917-000-0005",
// 		sex: "Male",

// 		role: "Dormitory Manager",
// 		status: "Active",
// 	},
// ];

export async function createUser(userDetails: any[], userType: string, password: string): Promise<User> {
	// RETURNS the newly inserted USER

	// this is for returning the newly inserted user
	const { data, error } = await supabase
		.from('user')
		.insert([{ 
			account_email: userDetails[0],
			password: password,
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
}

export async function updateUser(userId: string, userDetails: any[]): Promise<User> {
	// update all attributes of the user based on their account number
	// RETURNS the updated object (user)

	const { data, error } = await supabase
		.from('user')
		.update(userDetails)
		.eq('account_number', userId)
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function deactivateUser(userId: string): Promise<User> {
	// soft delete a user based on their user ID
	// returns the user

	const { data, error } = await supabase
		.from('user')
		.update({ is_deleted: true })
		.eq('account_number', userId)
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

export async function findAllUsers(): Promise<User[]> {
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

	userId = '1'; // test
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
		throw new Error(error.message);
	}

	return data;
}