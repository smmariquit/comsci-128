import { NewUser } from "@/models/user";
import { userData } from "./user-data";
import { supabase } from "../supabase";

// Create Student
export const createStudent = async (
    userDetails: NewUser,
    password: string,
) => {
    // set fields as student
    const studentUser: NewUser = {
        ...userDetails,
        user_type: "Student",
        password: password,
    };

    // create user
    const newUser = await userData.createUser(studentUser);

    // create student
    const { data, error } = await supabase
        .from('student')
        .insert([{
            account_number: newUser.account_number,
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};