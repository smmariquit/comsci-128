import { supabase } from "@/app/lib/supabase";
import { Application, NewApplication, UpdateApplication } from "@/models/application"

async function create(application: Application) {
	const { data, error } = await supabase
		.from("application")
		.insert([application])
		.select();
	if (error) throw error;
	return data;
}

async function getAll() {
	const { data, error } = await supabase.from("application").select("*");
	if (error) throw error;
	return data;
}

async function getById(applicationId: number) {
	const { data, error } = await supabase
		.from("application")
		.select("*")
		.eq("application_id", applicationId);
	if (error) throw error;
	return data;
}

async function getByManager(
	managerAccountNumber: number,
) {
  const { data, error } = await supabase
    .from("application")
    .select(
      `application_id, housing_name, preferred_room_type, application_status, expected_moveout_date, actual_moveout_date, room_id, student_account_number, is_deleted, manager:manager_account_number(account_number)`,
    )
    .eq("manager.account_number", managerAccountNumber)
    .eq("is_deleted", false);

  if (error) throw error;
  return data;
}

async function getByHousing(housingId: number) {
	const { data, error } = await supabase
		.from("application")
		.select(`*, room:room_id(housing_id)`)
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

	if(error) throw new Error(`Get Submitted Documents under Application Error: ${error.message}`);

	return data;
}

export const applicationData = {
	create,
	getAll,
	getById,
	getByManager,
	getByHousing,
	update,
	remove,
	getDocuments
}
