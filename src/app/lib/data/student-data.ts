import { NewUser } from "@/models/user";
import { userData } from "./user-data";
import { supabase } from "../supabase";

// Create Student
export const createStudent = async (
    userDetails: NewUser,
    password: string,
    student_number: Number
) => {
    // Remove extra fields before inserting into user table
    const { student_number: _, ...userOnly } = userDetails as any;

    // set fields as student
    const studentUser: NewUser = {
        ...userOnly,
        user_type: "Student",
        password: password,
    };

    // create user
    const newUser = await userData.createUser(studentUser);

    // create student
    const studentInsert = {
        account_number: newUser.account_number,
        student_number: Number(student_number),
    };

    const { data, error } = await supabase
        .from('student')
        .insert([studentInsert]) 
        .select()
        .single();

    if (error) throw error;
    return data;
};