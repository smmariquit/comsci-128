import { userService } from "./user-service";
import { NewUser, User } from "../models/user";
import { createStudent } from "../data/student-data";

export const addStudent = async (
    userDetails: NewUser,
    password: string
): Promise<any> => {
    try {
        // Use your existing createStudent function
        const student = await createStudent(userDetails, password);
        return student;
    } catch (error) {
        console.error("Error creating student: ", error);
        throw error;
    }
};