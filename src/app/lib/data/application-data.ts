import { supabase } from "@/app/lib/supabase";

export type PreferredRoomType = "Single" | "Double" | "Shared";
export type ApplicationStatus =
	| "Approved"
	| "Pending"
	| "Cancelled"
	| "Rejected";

export interface Application {
	application_id?: number;
	housing_name: string;
	preferred_room_type: PreferredRoomType;
	application_status: ApplicationStatus;
	expected_moveout_date: Date;
	actual_moveout_data: Date;
	room_id?: number;
	manager_account_number: number;
	student_account_number: number;
	is_deleted?: boolean;
}

// CREATE APPLICATION
export async function createApplication(application: Application) {
	const { data, error } = await supabase
		.from("application")
		.insert([application])
		.select();
	if (error) throw error;
	return data;
}

// READ ALL APPLICATIONS
export async function getAllApplications() {
	const { data, error } = await supabase
	.from("application")
	.select(`
		application_id,
		housing_name,
		preferred_room_type,
		expected_moveout_date,
		application_status,
		student:student!student_account_number (
			housing_status,
			user:user!account_number (
				first_name,
				last_name
			)
		)
	`)
	.eq("is_deleted", false);

	if (error) throw error;
	return data;
}

// READ APPLICATION BASED ON APPLICATION ID
export async function getApplicationsByApplicationId(application_id: number) {
	const { data, error } = await supabase
		.from("application")
		.select("*")
		.eq("application_id", application_id);
	if (error) throw error;
	return data;
}

// READ APPLICATION BASED ON MANAGER ACCOUNT NUMBER
export async function getApplicationsByManagerAccounttNumber(
	manager_account_number: number,
) {
	const { data, error } = await supabase
		.from("application")
		.select(
			`application_id, housing_name, preferred_room_type, application_status, expected_moveout_date, actual_moveout_date, room_id, student_account_number, is_deleted, manager:manager_account_number(account_number)`,
		)
		.eq("manager.account_number", manager_account_number)
		.eq("is_deleted", false);

	if (error) throw error;
	return data;
}

// READ APPLICATION BASED ON HOUSING ID
export async function getApplicationsByHousingId(housing_id: number) {
	const { data, error } = await supabase
		.from("application")
		.select(`*, room:room_id(housing_id)`)
		.eq("room.housing_id", housing_id);
	if (error) throw error;
	return data;
}

// UPDATE APPLICATION
export async function updateApplication(
	application_id: number,
	updatedFields: Partial<Application>,
) {
	const { data, error } = await supabase
		.from("application")
		.update(updatedFields)
		.eq("application_id", application_id)
		.eq("is_deleted", false)
		.select();
	if (error) throw error;
	return data;
}

// DELETE APPLICATION (SOFT DELETION)
export async function deleteApplication(application_id: number) {
	const { data, error } = await supabase
		.from("application")
		.update({ is_deleted: true })
		.eq("application_id", application_id)
		.select();
	if (error) throw error;
	return data;
}
