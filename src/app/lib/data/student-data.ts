import { userData } from "@/data/user-data";
import type {
	NewStudent,
	Student,
	StudentProfile,
	UpdateStudent,
} from "@/models/student";
import type {
	NewStudentAcademic,
	StudentAcademic,
	UpdateStudentAcademic,
} from "@/models/student_academic";
import type { StudentAccommodationHistory } from "@/models/student_accommodation";
import type { NewUser } from "@/models/user";

import { supabase } from "../supabase";

<<<<<<< HEAD
=======
type RoomPerHousing = {
	total: number;
	occupied: number;
};

>>>>>>> 00ed3308e8ef423b0a87bed02f4c5e9e85757c0e
async function create(
	userDetails: NewUser,
	studentDetails: NewStudent,
	studentAcademicDetails: NewStudentAcademic,
): Promise<Student> {
	const newUserData = await userData.create(userDetails);

	studentDetails.account_number = newUserData.account_number;
	studentAcademicDetails.account_number = newUserData.account_number;

	const { data, error } = await supabase
		.from("student")
		.insert([studentDetails])
		.select();

	if (error) throw new Error(`Create Student Error: ${error.message}`);

	createAcademic(studentAcademicDetails);

	return data[0];
}

async function createAcademic(
	academicData: NewStudentAcademic,
): Promise<NewStudentAcademic> {
	const { data, error } = await supabase
		.from("student_academic")
		.insert([academicData])
		.select();

	if (error)
		throw new Error(`Academic Record Creation Error: ${error.message}`);

	return data[0];
}

async function findStudentProfileById(
	accountNumber: number,
): Promise<StudentProfile | null> {
	const { data, error } = await supabase
		.from("user")
		.select(
			`
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
            student:student_account_number_fkey(
                account_number,
                student_number,
                housing_status,
                emergency_contact_name,
                emergency_contact_number,
                emergency_contact_relationship,
                student_academic:student_academic_account_number_fkey(
                    account_number,
                    degree_program,
                    standing,
                    status
                )
            )
            `,
		)
		.eq("account_number", accountNumber)
		.eq("is_deleted", false)
		.single();

	if (error) {
		console.error("Error fetching student profile:", error);
		return null;
	}

	return data;
}

async function updateStudent(
	accountNumber: number,
	updates: UpdateStudent,
): Promise<Student | null> {
	console.log(updates);
	const { data, error } = await supabase
		.from("student")
		.update(updates)
		.eq("account_number", accountNumber)
		.select();

	if (error) {
		console.error("Error updating student:", error);
		return null;
	}
	return data[0];
}

async function getStudentAcademicById(accountNumber: number) {
	const { data, error } = await supabase
		.from("student_academic")
		.select("*")
		.eq("account_number", accountNumber);

	if (error) throw new Error(error.message);
	return data[0];
}

async function updateAcademicDetails(
	accountNumber: number,
	updates: Partial<StudentAcademic>,
) {
	const { data, error } = await supabase
		.from("student_academic")
		.update(updates)
		.eq("account_number", accountNumber)
		.select();

	if (error) {
		console.error("Error updating student academic:", error);
		return null;
	}

	return data[0];
}

// CREATE a stay record (Check-in)
async function createAccommodationHistory(
	history: StudentAccommodationHistory,
) {
	const { data, error } = await supabase
		.from("student_accommodation_history")
		.insert([history])
		.select();

	if (error)
		throw new Error(`History Record Creation Error: ${error.message}`);
	return data[0];
}

// UPDATE a stay record (Check-out)
async function recordMoveOut(accountNumber: number, actualDate: string) {
	const { data, error } = await supabase
		.from("student_accommodation_history")
		.update({
			actual_move_out_date: actualDate,
			status: "Not Assigned",
		})
		.eq("account_number", accountNumber)
		.is("actual_move_out_date", null) // Ensures we only update the active stay
		.select();

	if (error) throw new Error(error.message);
	return data;
}

// GET current occupants in a room (Logic for room.ts)
// Counts records where the student has not yet moved out.
async function getRoomOccupantCount(roomId: number): Promise<number> {
	const { count, error } = await supabase
		.from("student_accommodation_history")
		.select("*", { count: "exact", head: true })
		.eq("room_id", roomId)
		.is("actual_move_out_date", null);

	if (error) throw new Error(error.message);
	return count ?? 0;
}

// GET submitted application details of a student (Pending Status)
async function getSubmittedApplications(accountNumber: number) {
	const { data, error } = await supabase
		.from("application")
		.select(
			`application_id, housing_name, preferred_room_type, application_status, expected_moveout_date, actual_moveout_date, room_id, manager_account_number, student_account_number`,
		)
		.eq("student_account_number", accountNumber)
		.eq("application_status", "Pending")
		.eq("is_deleted", false);

	if (error) throw error;
	return data;
}

// GET list of available housing options based on rent_price (asc), housing_type, room_type
async function getHousingOptions({
	sortOrder = "asc",
	housingType = null,
	roomType = null,
}) {
	let query = supabase
		.from("housing")
		.select(
			`housing_id, housing_name, start_application_date, end_application_date, housing_address, housing_type, rent_price, manager_account_number, room!inner(room_id, occupancy_status, room_type)`,
		)
		.neq("room.occupancy_status", "Fully Occupied")
		.eq("is_deleted", false)
		.order("rent_price", { ascending: sortOrder === "asc" });

	if (housingType) {
		query = query.eq("housing_type", housingType);
	}

	if (roomType) {
		query = query.eq("room.room_type", roomType);
	}

	const { data, error } = await query;

	if (error) throw error;
	return data;
}

// GET ratio of occupied rooms to total rooms
async function getRoomOccupancyRate() {
	const housingDetails: Record<number, RoomPerHousing> = {};
	//gets all total rooms
	const { data: totalRooms, error: totalError } = await supabase
		.from("room")
		.select("housing_id")
		.eq("is_deleted", false);

	if (totalError) throw totalError;

	//gets all occupied rooms
	const { data: occupiedRooms, error: occupiedError } = await supabase
		.from("room")
		.select("housing_id")
		.eq("is_deleted", false)
		.gte("occupants_count", 1);

	if (occupiedError) throw occupiedError;

	//counts total rooms per housing
	totalRooms?.forEach((room) => {
		if (!housingDetails[room.housing_id]) {
			housingDetails[room.housing_id] = { total: 0, occupied: 0 };
		}
		housingDetails[room.housing_id].total += 1;
	});

	//counts occupied rooms per housing
	occupiedRooms?.forEach((room) => {
		if (!housingDetails[room.housing_id]) {
			housingDetails[room.housing_id] = { total: 0, occupied: 0 };
		}
		housingDetails[room.housing_id].occupied += 1;
	});

	//returns occupancy rate (in decimal form)
	const occupancyRate = Object.entries(housingDetails).map(
		([housing_id, stats]) => ({
			housing_id,
			rate: stats.total > 0 ? stats.occupied / stats.total : 0,
		}),
	);

	return occupancyRate;
}

async function getAccommodationHistoryOfStudent(studentAccountNumber: number) {
	// get the accommodation history of a student and their user + student details

	const { data, error } = await supabase
		.from("student_accommodation_history")
		.select(
			`
        *,
        student!inner(*),
        room!inner(*),
        housing!inner(*),
        user!inner(*)
      `,
		)
		.eq(
			"student_accommodation_history.account_number",
			studentAccountNumber,
		);

	if (error)
		throw new Error(
			`getAccommodationHistoryOfStudent Error: ${error.message}`,
		);
	return data;
}

async function getActiveHousingDetails(studentAccountNumber: number) {
	// get the details of the active housing and room of a student given a student's account number

	const { data: studentHousingDetails, error } = await supabase
		.from("student_accommodation_history")
		.select(
			`
			*,
			room!inner(*),
			housing!inner(*)
		`,
		)
		.eq("account_number", studentAccountNumber)
		.is("student_accommodation_history.moveout_date", null);

	if (error)
		throw new Error(`getHousingDetailsofStudent Error: ${error.message}`);

	return studentHousingDetails;
}

const getBillingSummary = async (accountNumber: number) => {
	const { data, error } = await supabase
		.from("bill")
		.select(`
			transaction_id,
			amount,
			status,
			due_date,
			bill_type,
			manager!inner(
				manager_type,
				user!inner (
					first_name,
					last_name
				)
			)
		`)
		.eq("student_account_number", accountNumber)
		.eq("is_deleted", false);

	if (error) throw error;

	// Calculate total balance for Pending and Overdue bills
	const total_outstanding =
		data
			?.filter(
				(bill: any) =>
					bill.status === "Pending" || bill.status === "Overdue",
			)
			?.reduce(
				(sum: number, bill: any) => sum + Number(bill.amount),
				0,
			) || 0;

	// Detailed list including price and bill type
	const breakdown = data.map((bill: any) => ({
		id: bill.transaction_id,
		amount: bill.amount,
		bill_type: bill.bill_type,
		status: bill.status,
		due_date: bill.due_date,
		pay_to: `${bill.manager?.user?.first_name} ${bill.manager?.user?.last_name}`,
		manager_role: bill.manager?.manager_type,
	}));

	return {
		total_outstanding,
		breakdown,
	};
};

const getBillingHistory = async (accountNumber: number) => {
	const { data, error } = await supabase
		.from("bill")
		.select(`
			transaction_id,
			amount,
			bill_type,
			status,
			date_paid,
			due_date,
			manager!inner(
				user!inner (
					first_name,
					last_name
				)
			)
		`)
		.eq("student_account_number", accountNumber)
		.eq("is_deleted", false)
		.order("due_date", { ascending: false });

	if (error) throw error;

	return data;
};

const getUnpaidBills = async (accountNumber: number) => {
	const { data, error } = await supabase
		.from("bill")
		.select(`
			transaction_id,
			amount,
			bill_type,
			due_date,
			status,
			manager!inner(
				user!inner (
					first_name,
					last_name,
					account_email
				)
			)
		`)
		.eq("student_account_number", accountNumber)
		.in("status", ["Pending", "Overdue"])
		.eq("is_deleted", false)
		.order("due_date", { ascending: true });

	if (error) throw error;

	return data;
};

export const studentData = {
<<<<<<< HEAD
    create,
    createAcademic,
    getStudentAcademicById,
    updateAcademicDetails,
    createAccommodationHistory,
    recordMoveOut,
    getRoomOccupantCount,
    getSubmittedApplications,
    getHousingOptions,
    getAccommodationHistoryOfStudent
}
=======
	create,
	createAcademic,
	findStudentProfileById,
	updateStudent,
	getStudentAcademicById,
	updateAcademicDetails,
	createAccommodationHistory,
	recordMoveOut,
	getRoomOccupantCount,
	getSubmittedApplications,
	getHousingOptions,
	getRoomOccupancyRate,
	getAccommodationHistoryOfStudent,
	getActiveHousingDetails,
	getBillingSummary,
	getBillingHistory,
	getUnpaidBills,
};
>>>>>>> 00ed3308e8ef423b0a87bed02f4c5e9e85757c0e
