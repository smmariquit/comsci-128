import { NewUser, User } from "../models/user";
import { NewStudent } from "../models/student";
import { NewStudentAcademic } from "@/models/student_academic";
import { studentData } from "../data/student-data";
import { Student } from "../models/student";

export const addStudent = async (
    userDetails: NewUser,
    studentDetails: NewStudent,
    studentAcademicDetails: NewStudentAcademic,
): Promise<any> => {
    try {
        const student = await studentData.create(userDetails, studentDetails, studentAcademicDetails);
        return student;
    } catch (error) {
        console.error("Error creating student:", error);
        throw error;
    }
};

const deactivateStudent = async (accountNumber: number): Promise<Student | null> => {
  try {
    const student = await studentData.deactivate(accountNumber);
    if (!student) return null;
    return student;
  } catch (error) {
    console.error("Error deactivating student:", error);
    throw new Error("Failed to deactivate student");
  }
};

export const studentService = {
  deactivateStudent, 
};