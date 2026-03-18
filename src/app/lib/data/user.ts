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

export async function findAllUsers(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase.from('user').select();

	if (error) {
		throw new Error(error.message);
	}

	return data ?? null;
}

export async function findUserById(userId: string): Promise<User | null> {
	//This function takes a USERID of type STRING.
	// RETURNS a USER object when found in the DB, otherwise return null.

	userId = '1'; // test
	const { data, error } = await supabase.from('user').select().eq('account_number', userId).single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}
