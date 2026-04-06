<<<<<<< HEAD
import { Enums } from "../../types/database.types";

type UserType = Enums<'UserType'>;
type Sex = Enums<'Sex'>;
type AccountDeletionStatus = true | false;

export interface User {
	// For Audit Trails
	userId: number;

	// Authentication: must be UP Mail / Google
	accountEmail: string;

	// User Profile fields
	firstName: string;
	middleName?: string; // optional
	lastName: string;
	permAddress?: string; // optional
	contactNumber?: string; // optional
	contactEmail?: string; // optional
	sex?: Sex; // optional
	birthday?: Date; // optional
	age?: number; // optional

	// Role-Based Access Control
	userRole: UserType;

	// Status for account deactivation
	status: AccountDeletionStatus;
}
=======
import { Tables, TablesInsert, TablesUpdate } from "@/app/types/database.types";

export type User = Tables<"user">;
export type NewUser = TablesInsert<"user">;
export type UpdateUser = TablesUpdate<"user">;
>>>>>>> edb4d3bd3cec07198ecac0ed8601a56cdab552c4
