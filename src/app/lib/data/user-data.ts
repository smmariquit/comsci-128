import type { NewUser, UpdateUser, User } from "@/models/user";
import { supabase } from "../supabase";
import { count } from "console";

async function create(userDetails: NewUser): Promise<User> {
	// this is for returning the newly inserted user
	const { data, error } = await supabase
		.from("user")
		.insert(userDetails)
		.select();

  if (error) {
    throw new Error(error.message);
  }

  return data[0];
}

async function findAll(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase
	.from('user')
	.select()
	.eq('is_deleted', false);

  if (error) throw new Error(`Get All Users Error: ${error.message}`);

	return data ?? [];
}

async function findById(userId: number): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("account_number", userId)
		.eq("is_deleted", false);

  if (error) throw new Error(`Find User by ID Error: ${error.message}`);

  return data && data.length > 0 ? data[0] : null;
}

async function findByEmail(userEmail: string): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("account_email", userEmail)
		.eq("is_deleted", false);

  if (error) throw new Error(`Find User by Email Error: ${error.message}`);

  return data && data.length > 0 ? data[0] : null;
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
    .select();

  if (error) throw new Error(`Update User Error: ${error.message}`);

  return data && data.length > 0 ? data[0] : null;
}

async function deactivate(userId: number): Promise<UpdateUser | null> {
	// This function takes a USERID of type STRING.
	// CHANGES is_deleted field to true if user is found, otherwise return null.

  const { data, error } = await supabase
    .from("user")
    .update({ is_deleted: true })
    .eq("account_number", userId)
    .select();

  if (error) throw new Error(`Deactivate User Error: ${error.message}`);

  return data && data.length > 0 ? data[0] : null;
}

async function findStudents(): Promise<any[]> {
	// returns students ONLY
	const { data, error } = await supabase
	.from("user")
	.select(`
		account_number, 
		first_name, 
		last_name, 
		student:student!account_number (
			housing_status
		)`
	)
	.eq("user_type", "Student")
	.eq("is_deleted", false);

	if (error) {
		throw new Error(error.message);
	}

	return data ?? null;
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
    histories?.forEach(h => userIds.add(h.account_number));
    applications?.forEach(a => a.student_account_number && userIds.add(a.student_account_number));

    // short-circuit for empty housing
    if (userIds.size === 0) return [];

    // fetch only the specific users we need
    const { data: users, error: userError } = await supabase
        .from("user")
        .select(`
            account_number,
            first_name,
            last_name,
            account_email,
            phone_number,
            user_type,
            sex
        `)
        .in("account_number", Array.from(userIds));

    if (userError) throw new Error("User Error: " + userError.message);

    return users.map(user => {
        const userHistories = histories?.filter(h => h.account_number === user.account_number) || [];
        const userApps = applications?.filter(a => a.student_account_number === user.account_number) || [];

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

            // ✅ Fixed: appRoom was referenced but never defined
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
async function countActiveUsers():Promise<number | null> {
	const { count, error } = await supabase
      .from("user")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false);

	if (error) throw new Error(error.message);

	return count;
}

export const userData = {
	findStudents,
	getUsersForHousingAdmin,
  create,
  findAll,
  findById,
  findByEmail,
  update,
  deactivate,
  countAllUser,
	countActiveUsers,
};
