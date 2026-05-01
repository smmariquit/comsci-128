import type { NewUser, UpdateUser, User } from "@/models/user";
import { supabase } from "../supabase";
import { count } from "console";

// ============================================
// Define safe fields to NEVER select from user table
// ============================================
const SAFE_USER_FIELDS = `
  account_number,
  account_email,
  first_name,
  middle_name,
  last_name,
  sex,
  birthday,
  home_address,
  phone_number,
  contact_email,
  profile_picture,
  user_type,
  is_deleted
` as const;

// Helper function to sanitize user data
function sanitizeUserData(userData: any) {
	if (!userData) return null;
	const { password, google_identity, ...safeUser } = userData;
	return safeUser;
}

async function create(userDetails: NewUser): Promise<User> {
	// this is for returning the newly inserted user
	const { data, error } = await supabase
		.from("user")
		.insert(userDetails)
		.select(SAFE_USER_FIELDS);

	if (error) {
		throw new Error(error.message);
	}

	// Sanitize the returned data
	return sanitizeUserData(data[0]);
}

async function findAll(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase
		.from('user')
		.select(SAFE_USER_FIELDS)
		.eq('is_deleted', false);

	if (error) throw new Error(`Get All Users Error: ${error.message}`);

	// Sanitize all users in the array
	const sanitizedData = data?.map((user: any) => sanitizeUserData(user)) ?? [];
	return sanitizedData;
}

async function findById(userId: number): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select(SAFE_USER_FIELDS)
		.eq("account_number", userId)
		.eq("is_deleted", false);

	if (error) throw new Error(`Find User by ID Error: ${error.message}`);

	const user = data && data.length > 0 ? data[0] : null;
	return sanitizeUserData(user);
}

async function findByEmail(userEmail: string): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select(SAFE_USER_FIELDS)
		.eq("account_email", userEmail)
		.eq("is_deleted", false);

	if (error) throw new Error(`Find User by Email Error: ${error.message}`);

	const user = data && data.length > 0 ? data[0] : null;
	return sanitizeUserData(user);
}

async function findByGoogleIdentity(googleIdentity: string): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select(SAFE_USER_FIELDS)
		.eq("google_identity", googleIdentity)
		.eq("is_deleted", false);

	if (error) throw new Error(`Find User by Google Identity Error: ${error.message}`);

	const user = data && data.length > 0 ? data[0] : null;
	return sanitizeUserData(user);
}

async function update(
	userId: number,
	userDetails: UpdateUser,
): Promise<UpdateUser | null> {
	// update all attributes of the user based on their account number
	// RETURNS the updated object (user)

	const { data, error } = await supabase
		.from("user")
		.update(userDetails)
		.eq("account_number", Number(userId))
		.select(SAFE_USER_FIELDS);

	if (error) throw new Error(`Update User Error: ${error.message}`);

	const user = data && data.length > 0 ? data[0] : null;
	return sanitizeUserData(user);
}

async function deactivate(email: string): Promise<UpdateUser | null> {
	// This function takes a USERID of type STRING.
	// CHANGES is_deleted field to true if user is found, otherwise return null.

	const { data, error } = await supabase
		.from("user")
		.update({ is_deleted: true })
		.eq("account_email", email)
		.select(SAFE_USER_FIELDS);

	if (error) throw new Error(`Deactivate User Error: ${error.message}`);

	const user = data && data.length > 0 ? data[0] : null;
	return sanitizeUserData(user);
}

async function findStudents(): Promise<any[]> {
	// returns students ONLY
	const { data, error } = await supabase
		.from("user")
		.select(`
			${SAFE_USER_FIELDS},
			student:student!account_number (
				housing_status
			)
		`)
		.eq("user_type", "Student")
		.eq("is_deleted", false);

	if (error) {
		throw new Error(error.message);
	}

	// Sanitize the returned data
	const sanitizedData = data?.map((user: any) => sanitizeUserData(user)) ?? [];
	return sanitizedData;
}

// get users for housing admin by tracing student accommodation history for students
// Added pending applications
// TODO: Also query non-student users under housing admin
async function getUsersForHousingAdmin(managedHousingIds: number[]): Promise<any[]> {
	// get student accommodation history of managed housings
	const { data: histories, error: histError } = await supabase
		.from("student_accommodation_history")
		.select(`
			account_number,
			movein_date,
			moveout_date,
			room!inner (
				housing_id,
				housing ( housing_name )
			)
		`)
		.in("room.housing_id", managedHousingIds);

	if (histError) throw new Error("History Error: " + histError.message);

	// get pending applications of managed housing ids
	const { data: applications, error: appliError } = await supabase
		.from("application")
		.select(`
			student_account_number,
			application_status,
			housing_name,
			room!inner ( 
				housing_id,
				housing ( housing_name )
			)
		`)
		.in("room.housing_id", managedHousingIds)
		.in("application_status", ["Pending Manager Approval", "Pending Admin Approval"]);

	if (appliError && appliError.code !== 'PGRST116') throw new Error("App Error: " + appliError.message);

	const userIds = new Set<number>();
	histories?.forEach((h: { account_number: number; }) => userIds.add(h.account_number));
	applications?.forEach((a: { student_account_number: number; }) => a.student_account_number && userIds.add(a.student_account_number));

	// short-circuit for empty housing
	if (userIds.size === 0) return [];

	// fetch only the specific users we need
	const { data: users, error: userError } = await supabase
		.from("user")
		.select(`
			${SAFE_USER_FIELDS}
		`)
		.in("account_number", Array.from(userIds));

	if (userError) throw new Error("User Error: " + userError.message);

	// Sanitize users
	const sanitizedUsers = users?.map((user: any) => sanitizeUserData(user)) ?? [];

	return sanitizedUsers.map((user: { account_number: any; first_name: any; last_name: any; account_email: any; phone_number: any; user_type: any; sex: any; }) => {
		const userHistories = histories?.filter((h: { account_number: any; }) => h.account_number === user.account_number) || [];
		const userApps = applications?.filter((a: { student_account_number: any; }) => a.student_account_number === user.account_number) || [];

		// localize housing status instead of using user's global housing status
		let localHousingStatus = "Not Assigned";
		let currentHousingId = null;
		let currentHousingName = undefined;
		let is_inactive = true;

		// student recent accommodation check
		if (userHistories.length > 0) {
			const latestHistory = userHistories.sort((a: any, b: any) =>
				new Date(b.movein_date).getTime() - new Date(a.movein_date).getTime()
			)[0];

			const latestRoom = Array.isArray(latestHistory.room)
				? latestHistory.room[0]
				: latestHistory.room;

			currentHousingId = latestRoom?.housing_id || null;
			currentHousingName = latestRoom?.housing?.[0]?.housing_name;

			const isCurrentlyLivingThere = !latestHistory.moveout_date || new Date(latestHistory.moveout_date) > new Date();

			if (isCurrentlyLivingThere) {
				localHousingStatus = "Assigned";
				is_inactive = false; // Active Tenant
			} else {
				localHousingStatus = "Not Assigned";
				is_inactive = true; // Past Tenant (mark as removed)
			}
		}

		// add users with pending applications
		if (localHousingStatus !== "Assigned" && userApps.length > 0) {
			localHousingStatus = "Pending";
			is_inactive = false;

			const appRoom = Array.isArray(userApps[0].room)
				? userApps[0].room[0]
				: userApps[0].room;

			currentHousingId = appRoom?.housing_id || null;
			currentHousingName = userApps[0].housing_name || appRoom?.housing?.[0]?.housing_name || null;
		}

		return {
			account_number: user.account_number,
			full_name: `${user.first_name} ${user.last_name}`,
			account_email: user.account_email,
			phone_number: user.phone_number,
			user_type: user.user_type,
			is_deleted: is_inactive,
			sex: user.sex,
			housing_status: localHousingStatus,
			housing_name: currentHousingName,
			housing_id: currentHousingId
		};
	});
}

async function countAllUser(): Promise<number | null> {
	const { count, error } = await supabase
		.from("user")
		.select("*", { count: "exact", head: true });

	if (error) throw new Error(error.message);

	return count;
}

// Counts only active users (not marked as deleted)
async function countActiveUsers(): Promise<number | null> {
	const { count, error } = await supabase
		.from("user")
		.select("*", { count: "exact", head: true })
		.eq("is_deleted", false);

	if (error) throw new Error(error.message);

	return count;
}

// For changing user role
async function promote(
	account_email: string,
	userDetails: UpdateUser,
): Promise<UpdateUser | null> {

	const { data, error } = await supabase
		.from("user")
		.update(userDetails)
		.eq("account_email", account_email)
		.select(SAFE_USER_FIELDS);

	if (error) throw new Error(`Update User Error: ${error.message}`);

	const user = data && data.length > 0 ? data[0] : null;
	return sanitizeUserData(user);
}

export const userData = {
	findStudents,
	getUsersForHousingAdmin,
	create,
	findAll,
	findById,
	findByEmail,
	findByGoogleIdentity,
	update,
	deactivate,
	countAllUser,
	countActiveUsers,
	promote
};