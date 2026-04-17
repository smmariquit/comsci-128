import { userData } from "@/data/user-data";
import type { NewStudent, Student, StudentProfile } from "@/models/student";
import type {
	NewStudentAcademic,
	StudentAcademic,
} from "@/models/student_academic";
import type { StudentAccommodationHistory } from "@/models/student_accommodation";
import type { NewUser } from "@/models/user";

import { supabase } from "../supabase";

export type StudentStanding = "Freshman" | "Sophomore" | "Junior" | "Senior";
export type StudentStatus = "Active" | "Delayed" | "Graduating";
export type HousingStatus = "Assigned" | "Not Assigned";

async function createUserStudent(
	userDetails: NewUser,
	studentDetails: NewStudent,
	studentAcademicDetails: NewStudentAcademic,
): Promise<Student> {
	const newUserData = await userData.createUser(userDetails);

	studentDetails.account_number = newUserData.account_number;
	studentAcademicDetails.account_number = newUserData.account_number;

	const { data, error } = await supabase
		.from("student")
		.insert([studentDetails])
		.select();

	if (error) throw new Error(`Create Student Error: ${error.message}`);

	createStudentAcademic(studentAcademicDetails);

	return data[0];
}

async function createStudentAcademic(
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

async function _getStudentAcademicById(accountNumber: number) {
	const { data, error } = await supabase
		.from("student_academic")
		.select("*")
		.eq("account_number", accountNumber)
		.single();

	if (error) throw new Error(error.message);
	return data;
}

// UPDATE academic record

async function _updateStudentAcademic(
	accountNumber: number,
	updates: Partial<StudentAcademic>,
) {
	const { data, error } = await supabase
		.from("student_academic")
		.update(updates)
		.eq("account_number", accountNumber)
		.select()
		.single();

	if (error) throw new Error(error.message);
	return data;
}

// CREATE a stay record (Check-in)
async function _createAccommodationHistory(
	history: StudentAccommodationHistory,
) {
	const { data, error } = await supabase
		.from("student_accommodation_history")
		.insert([history])
		.select()
		.single();

	if (error)
		throw new Error(`History Record Creation Error: ${error.message}`);
	return data;
}

// UPDATE a stay record (Check-out)
async function _recordMoveOut(accountNumber: number, actualDate: string) {
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
async function _getRoomOccupantCount(roomId: number): Promise<number> {
	const { count, error } = await supabase
		.from("student_accommodation_history")
		.select("*", { count: "exact", head: true })
		.eq("room_id", roomId)
		.is("actual_move_out_date", null);

	if (error) throw new Error(error.message);
	return count ?? 0;
}

async function _getAccommodationHistoryOfStudent(studentAccountNumber: number) {
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
			`getAccommodatio nHistoryOfStudent Error: ${error.message}`,
		);
	return data;
}

export const studentData = {
	createUserStudent,
	findStudentProfileById,
};
