import { supabase } from "@/app/lib/supabase";
import {
	Application,
	NewApplication,
	UpdateApplication,
} from "@/models/application";

async function create(application: NewApplication): Promise<Application> {
	const { data, error } = await supabase
		.from("application")
		.insert([application])
		.select("*");

	if (error) throw error;

	return data[0];
}

// READ ALL APPLICATIONS
async function getAll() {
	const { data, error } = await supabase
		.from("application")
		.select(
			`
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
	`,
		)
		.eq("is_deleted", false);
}

async function getById(applicationId: number): Promise<Application | null> {
	const { data, error } = await supabase
		.from("application")
		.select("*")
		.eq("application_id", applicationId);
	if (error) throw error;

	return data && data.length > 0 ? data[0] : null;
}

async function getByManager(managerAccountNumber: number): Promise<Application[]>{
  const { data, error } = await supabase
    .from("application")
    .select(`
		application_id,
		housing_name,
		preferred_room_type, 
		application_status,
		expected_moveout_date,
		actual_moveout_date, 
		room_id, 
		student_account_number,
		manager:manager_account_number_fkey(account_number)
	`)
    .eq("manager.account_number", managerAccountNumber)
    .eq("application.is_deleted", false);

	if (error) throw error;
	return data ?? [];
}

async function getByHousing(housingId: number) {
	const { data, error } = await supabase
		.from("application")
		.select(`*, room!inner(housing_id)`)
		.eq("room.housing_id", housingId);
	if (error) throw error;
	return data;
}

async function update(
	applicationId: number,
	updatedFields: Partial<Application>,
) {
	const { data, error } = await supabase
		.from("application")
		.update(updatedFields)
		.eq("application_id", applicationId)
		.eq("is_deleted", false)
		.select();
	if (error) throw error;
	return data;
}

async function remove(applicationId: number) {
	const { data, error } = await supabase
		.from("application")
		.update({ is_deleted: true })
		.eq("application_id", applicationId)
		.select();
	if (error) throw error;
	return data;
}

async function getDocuments(applicationId: number) {
	// get the documents uploaded under the application
	// only contains the links of the images/files to the storage in Supabase

	const { data, error } = await supabase
		.from("application")
		.select("*, document!inner(*)")
		.eq("application.application_id", applicationId);

	if (error)
		throw new Error(
			`Get Submitted Documents under Application Error: ${error.message}`,
		);

	return data;
}

// GET SELECTED STATS FOR MANAGER DASHBOARD
async function getApplicationStats() {
	const { data, error } = await supabase
		.from("application")
		.select("application_status")
		.eq("is_deleted", false);

	if (error) {
		console.error("Error fetching applications stats: ", error);
		throw new Error("Failed to fetch application stats");
	}

	const total = data.length;
	const pending = data.filter(
		(a) => a.application_status === "Pending",
	).length;
	const approved = data.filter(
		(a) => a.application_status === "Approved",
	).length;
	const rejected = data.filter(
		(a) => a.application_status === "Rejected",
	).length;

	return { total, pending, approved, rejected };
}

// APPLICATION DATA JOINED WITH STUDENT ACCOUNT NUMBER
async function getApplicationsWithStudentDetails() {
	const { data, error } = await supabase
		.from("application")
		.select(
			`
      application_id,
      housing_name,
      application_status,
      expected_moveout_date,
      preferred_room_type,
      student:student_account_number (
        account_number,
        user:user!account_number (
          first_name,
          middle_name,
          last_name
        )
      )
    `,
		)
		.eq("is_deleted", false)
		.order("application_id", { ascending: false });

	if (error) {
		console.error("Error fetching applications with students: ", error);
		throw new Error("Failed to fetch applications");
	}

	return data ?? [];
}

// SINGLE APPLICATION DETAIL BY ID
async function getApplicationDetailById(applicationId: number) {
	const { data, error } = await supabase
		.from("application")
		.select(
			`
      application_id,
      housing_name,
      application_status,
      expected_moveout_date,
      preferred_room_type,
      student:student_account_number (
        account_number,
        user:user!account_number (
          first_name,
          middle_name,
          last_name
        )
      )
    `,
		)
		.eq("application_id", applicationId)
		.eq("is_deleted", false)
		.single();

	if (error) throw error;
	return data;
}

// RETRIEVE DOCUMENTS BY APPLICATION ID
async function getDocumentsByApplicationId(applicationId: number) {
	const { data, error } = await supabase
		.from("document")
		.select("document_id, type, storage_link")
		.eq("application_id", applicationId);

	if (error) throw error;
	return data;
}

// ASSIGN ROOM ID FOR AN APPLICATION ENTRY
async function assignRoomToApplication(applicationId: number, roomId: number) {
	const { data, error } = await supabase
		.from("application")
		.update({ room_id: roomId })
		.eq("application_id", applicationId)
		.eq("is_deleted", false)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}

//FETCH APPROVED APPLICATIONS WITH NULL ROOM ID
async function getApprovedUnassignedByHousingName(housingName: string) {
	const { data, error } = await supabase
		.from("application")
		.select(
			`
      application_id,
      housing_name,
      expected_moveout_date,
      student_account_number,
      student:student!account_number (
        account_number,
        user:user!account_number (
          first_name,
          middle_name,
          last_name
        )
      )
    `,
		)
		.eq("application_status", "Approved")
		.eq("housing_name", housingName)
		.eq("is_deleted", false)
		.is("room_id", null);

	if (error) throw new Error(error.message);
	return data ?? [];
}

export const applicationData = {
	create,
	getAll,
	getById,
	getByManager,
	getByHousing,
	update,
	remove,
	getDocuments,
	getApplicationStats,
	getApplicationsWithStudentDetails,
	getApplicationDetailById,
	getDocumentsByApplicationId,
	assignRoomToApplication,
	getApprovedUnassignedByHousingName,
};
