import { NewUser, User } from "../models/user";
import { NewStudent } from "../models/student";
import { NewStudentAcademic } from "@/models/student_academic";
import { studentData } from "../data/student-data";

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