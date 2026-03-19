import { User } from "@/models/user";
import test from "node:test";

//This serves as the mock 'Database' to test functions
const MOCK_USERS: User[] = [
	{
		account_number: 1,
		account_email: "nahidadapt@mappa.com",

		first_name: "Mahoraga",
		last_name: "Shikigami",
		home_address: "Shibuya, Tokyo, Japan",
		phone_number: "+81-90-0000-0001",

		user_type: "Student",
		is_deleted: false,
	},
	{
		userId: "2",
		email: "johnkaisen@mappa.com",

		firstName: "John",
		lastName: "Kaisen",
		permAddress: "Shinjuku, Tokyo, Japan",
		contactNumber: "+81-90-0000-0002",
		contactEmail: "john.personal@example.com",

		role: "Student",
		status: "Inactive",
	},
	{
		userId: "3",
		email: "susangrotto@mgmail.com",

		firstName: "Susan",
		lastName: "Grotto",
		permAddress: "Kyoto, Japan",
		contactNumber: "+81-90-0000-0003",
		sex: "Female",

		role: "Landlord",
		status: "Active",
	},
	{
		userId: "4",
		email: "alfredbuttler@wayne.com",

		firstName: "Bruce",
		middleName: "Thomas",
		lastName: "Wayne",
		permAddress: "Gotham City",
		contactNumber: "+1-202-555-0104",
		birthday: new Date("1985-02-19"),
		age: 40,

		role: "Housing Administrator",
		status: "Active",
	},
	{
		userId: "5",
		email: "allancruz@gov.ph",

		firstName: "Allan",
		lastName: "Cruz",
		permAddress: "Quezon City, Philippines",
		contactNumber: "+63-917-000-0005",
		sex: "Male",

		role: "Dormitory Manager",
		status: "Active",
	},
];

export async function findUserById(userId: string): Promise<User | null> {
	//This function takes a USERID of type STRING.
	// RETURNS a USER object when found in the DB, otherwise return null.

	//TODO: replace with actual Supabase queries when available

	const user = MOCK_USERS.find((u) => u.userId === userId);
	return user ?? null;
}

export async function mockUpdateUser(userId: number, updates: Partial<User>): Promise<User | null> {
	const userIndex = MOCK_USERS.findIndex((u) => u.account_number === userId);

	if (userIndex === -1) {
		return null;
	}

	MOCK_USERS[userIndex] = {
		...MOCK_USERS[userIndex],
		...updates
	}

	return MOCK_USERS[userIndex];
}

// mockUpdateUser test
const testId = "1"
const updatedFname = { first_name: "Mahorago" };

mockUpdateUser(testId, updatedFname).then((updatedUser) => {
	if (updatedUser) {
		console.log("Success: ", updatedUser.first_name);
	} else {
		console.error("Error!");
	}
});
