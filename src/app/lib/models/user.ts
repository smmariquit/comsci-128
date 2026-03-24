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
  password: string;
}

export interface Student extends User {
  user_type: 'Student';
  student_number: number;
  housing_status: HousingStatus;
  
  academic: {
    degree_program: string;
    standing: StudentStanding;
    status: StudentStatus;
  };

  emergency_contact?: {
    name?: string;
    number?: string;
    relationship?: string;
  };
}

export interface ManagerPaymentDetails {
  bank_number: number;   
  bank_type: string;
}

export interface Manager extends User {
  user_type: 'Manager';
  manager_type: ManagerType;
  payment_details?: ManagerPaymentDetails[];
}

export interface SystemAdmin extends User {
  user_type: 'System Admin';
}