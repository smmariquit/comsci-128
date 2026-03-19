//User Model Interface

export type UserType = "Student" | "Manager" | "System Admin";
export type ManagerType = 'Housing Administrator' | 'Landlord';
export type Sex = 'Male' | 'Female' | 'Prefer not to say';
export type HousingStatus = 'Assigned' | 'Not Assigned';
export type StudentStanding = 'Freshman' | 'Sophomore' | 'Junior' | 'Senior';
export type StudentStatus = 'Active' | 'Delayed' | 'Graduating';


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
	sex?: Sex; // optional

	// Role-Based Access Control
	user_type: UserType;

	// Status for account deactivation
	is_deleted?: boolean;
}
