import { User, NewUser, UpdateUser } from "@/models/user";
import { supabase } from "../supabase";

async function create(userDetails: NewUser): Promise<User> {
	// this is for returning the newly inserted user
	const { data, error } = await supabase
		.from("user")
		.insert(userDetails)
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
	// return data.account_number if PK
}

async function findAll(): Promise<User[]> {
	// RETURNS an array of USER rows when found in the DB; otherwise, returns null.

	const { data, error } = await supabase.from("user").select();

	if (error) {
		throw new Error(error.message);
	}

	return data ?? null;
}

async function findById(userId: number): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("account_number", userId)
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

async function findByEmail(userEmail: string): Promise<User | null> {
	const { data, error } = await supabase
		.from("user")
		.select()
		.eq("account_email", userEmail)
		.single();

	if (error) {
		return null;
	}

	return data;
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

	if (error) {
		throw new Error(error.message);
	}

	return data && data.length > 0 ? data[0] : null;
}

async function deactivateById(userId: number): Promise<UpdateUser | null> {
	//This function takes a USERID of type STRING.
	// CHANGES is_deleted field to true if user is found, otherwise return null.

	const { data, error } = await supabase
		.from("user")
		.update({ is_deleted: true })
		.eq("account_number", userId)
		.select()
		.single();

	if (error) {
		throw new Error(error.message);
	}

	return data;
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
// TODO: Also query non-student users under housing admin
async function getUsersForHousingAdmin(managedHousingIds: number[]): Promise<any[]> {
    const { data, error } = await supabase
        .from("user")
        .select(`
            account_number,
            first_name,
            last_name,
            account_email,
            phone_number,
            user_type,
            sex,
            student (
                housing_status,
                student_accommodation_history (
                    movein_date,
                    room (
                        housing_id,
                        housing ( housing_name )
                    )
                )
            )
        `);

	if (error) throw new Error(error.message);

	const mappedUsers = data.map((u: any) => {
		let currentHousingId = null;
		let currentHousingName = undefined;

		const history = u.student?.student_accommodation_history;

		if (history && history.length > 0) {
			const latestHistory = history.sort((a: any, b: any) => 
				new Date(b.movein_date).getTime() - new Date(a.movein_date).getTime()
			)[0];

			if (latestHistory?.room) {
				currentHousingId = latestHistory.room.housing_id;
				currentHousingName = latestHistory.room.housing?.housing_name;
			}
		}

		return {
			account_number: u.account_number,
			full_name: `${u.first_name} ${u.last_name}`,
			account_email: u.account_email,
			phone_number: u.phone_number,
			user_type: u.user_type,
			is_deleted: false, 	// TO DO: Remove this in the future
								// Mapped is_deleted to false by default for now since it is required to render table and for filter. 
			sex: u.sex,
			housing_status: u.student?.housing_status || undefined,
			housing_name: currentHousingName,
			housing_id: currentHousingId 
		};
	});

	return mappedUsers.filter(u => u.housing_id && managedHousingIds.includes(u.housing_id));
}

export const userData = {
	create,
	findAll,
	findById,
	findByEmail,
	update,
	deactivateById,
	findStudents,
	getUsersForHousingAdmin
};
