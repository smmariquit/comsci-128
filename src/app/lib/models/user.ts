//User Model Interface

export type UserRole =
	| "Student"
	| "Dormitory Manager"
	| "Housing Administrator"
	| "Landlord"
	| "System Administrator";

export type AccountStatus = "Active" | "Inactive";

export interface User {
	// For Audit Trails
	userId: string;

	// Authentication: must be UP Mail / Google
	email: string;

	// User Profile fields
	firstName: string;
	middleName?: string; // optional
	lastName: string;
	permAddress: string;
	contactNumber: string;
	contactEmail?: string; // optional
	sex?: string; // optional
	birthday?: Date; // optional
	age?: number; // optional

	// Role-Based Access Control
	role: UserRole;

	// Status for account deactivation
	status: AccountStatus;
}
