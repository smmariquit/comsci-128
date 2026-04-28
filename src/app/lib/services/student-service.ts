import { NewUser, User } from "../models/user";
import { NewStudent } from "../models/student";
import { NewStudentAcademic } from "@/models/student_academic";
import { studentData } from "../data/student-data";
import { userData } from "../data/user-data";

export const addStudent = async (
    userDetails: NewUser,
    studentDetails: NewStudent,
    studentAcademicDetails: NewStudentAcademic,
): Promise<any> => {
    try {
        const createdUser = await userData.create(userDetails);
        const accountNumber = createdUser.account_number;

        const student = await studentData.create(accountNumber, studentDetails, studentAcademicDetails);
        return student;
    } catch (error) {
        console.error("Error creating student:", error);
        throw error;
    }
};