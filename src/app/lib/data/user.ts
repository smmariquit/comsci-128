import { User } from "@/models/user";

//This serves as the mock 'Database' to test functions
const MOCK_USERS: User[] = [
	{
		account_number: 1,
		account_email: "mahoraga@mappa.com",
		first_name: "Mahoraga",
		last_name: "Shikigami",
		home_address: "Shibuya, Tokyo, Japan",
		phone_number: "+81-90-0000-0001",
		user_type: "Student",
		is_deleted: false,
	},
	{
		account_number: 2,
		account_email: "johnkaisen@mappa.com",
		first_name: "John",
		last_name: "Kaisen",
		home_address: "Shinjuku, Tokyo, Japan",
		phone_number: "+81-90-0000-0002",
		contact_email: "john.personal@example.com",
		user_type: "Student",
		is_deleted: false,
	},
	{
		account_number: 3,
		account_email: "susangrotto@mgmail.com",
		first_name: "Susan",
		last_name: "Grotto",
		home_address: "Kyoto, Japan",
		phone_number: "+81-90-0000-0003",
		sex: "Female",
		user_type: "Manager",
		is_deleted: false,
	},
	{
		account_number: 4,
		account_email: "alfredbuttler@wayne.com",
		first_name: "Bruce",
		middle_name: "Thomas",
		last_name: "Wayne",
		home_address: "Gotham City",
		phone_number: "+1-202-555-0104",
		birthday: new Date("1985-02-19"),
		user_type: "Manager",
		is_deleted: false,
	},
	{
		account_number: 5,
		account_email: "allancruz@gov.ph",
		first_name: "Allan",
		last_name: "Cruz",
		home_address: "Quezon City, Philippines",
		phone_number: "+63-917-000-0005",
		sex: "Male",
		user_type: "Manager",
		is_deleted: false,
	},
];

export async function findUserById(userId: number): Promise<User | null> {
	//This function takes a USERID of type STRING.
	// RETURNS a USER object when found in the DB, otherwise return null.

	//TODO: replace with actual Supabase queries when available

	const user = MOCK_USERS.find((u) => u.account_number === userId);
	return user ?? null;
}
