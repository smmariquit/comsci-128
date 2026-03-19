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
	account_number: number;

	// Authentication: must be UP Mail / Google
	account_email: string;

	// User Profile fields
	first_name: string;
	middle_name?: string; // optional
	last_name: string;
	birthday?: Date; // optional
	home_address?: string;
	phone_number?: string;
	contact_email?: string; // optional
	sex?: string; // optional

	// Role-Based Access Control
	user_type: UserRole;

	// Status for account deactivation
	is_deleted?: boolean;
}
