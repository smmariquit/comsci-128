import { userData } from "@/data/user-data";
import { NewUser } from "@/models/user";
import { Student, NewStudent } from "@/models/student";
import { StudentAcademic, NewStudentAcademic } from "@/models/student_academic";
import { StudentAccommodationHistory } from "@/models/student_accommodation";
import { supabase } from "../supabase";

async function create(
    userDetails: NewUser,
    studentDetails: NewStudent,
    studentAcademicDetails: NewStudentAcademic
): Promise<Student> {

	const newUserData = await userData.create(userDetails);
    
    studentDetails.account_number = newUserData.account_number;
    studentAcademicDetails.account_number = newUserData.account_number;

  const { data, error } = await supabase
    .from("student")
    .insert([studentDetails])
    .select();

  if (error) throw new Error(`Create Student Error: ${error.message}`);

    createAcademic(studentAcademicDetails)

  return data[0];
}

async function createAcademic(academicData: NewStudentAcademic): Promise<NewStudentAcademic> {
  const { data, error } = await supabase
    .from("student_academic")
    .insert([academicData])
    .select();

  if (error)
    throw new Error(`Academic Record Creation Error: ${error.message}`);

  return data[0];
}

async function getStudentAcademicById(accountNumber: number) {
  const { data, error } = await supabase
    .from("student_academic")
    .select("*")
    .eq("account_number", accountNumber)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

async function updateAcademicDetails(accountNumber: number, updates: Partial<StudentAcademic>) {
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
async function createAccommodationHistory(
  history: StudentAccommodationHistory,
) {
  const { data, error } = await supabase
    .from("student_accommodation_history")
    .insert([history])
    .select()
    .single();

  if (error) throw new Error(`History Record Creation Error: ${error.message}`);
  return data;
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

async function getAccommodationHistoryOfStudent(studentAccountNumber: number) {
  // get the accommodation history of a student and their user + student details

  const { data, error } = await supabase
    .from("student_accommodation_history")
    .select(`
        *,
        student!inner(*),
        room!inner(*),
        housing!inner(*),
        user!inner(*)
      `)
    .eq("student_accommodation_history.account_number", studentAccountNumber);

  if (error)
    throw new Error(
      `getAccommodatio nHistoryOfStudent Error: ${error.message}`,
    );
  return data;
}

export const studentData = {
    create,
    createAcademic,
    getStudentAcademicById,
    updateAcademicDetails,
    createAccommodationHistory,
    recordMoveOut,
    getRoomOccupantCount,
    getAccommodationHistoryOfStudent
}
