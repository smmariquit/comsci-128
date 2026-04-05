import { Tables, TablesInsert, TablesUpdate } from "@/app/types/database.types";

export type Student = Tables<"student">;
export type NewStudent = TablesInsert<"student">;
export type UpdateStudent = TablesUpdate<"student">;

export type StudentAcademic = Tables<"student_academic">;
export type NewStudentAcademic = TablesInsert<"student_academic">;
export type UpdateStudentAcademic = TablesUpdate<"student_academic">;

export type StudentAccommodationHistory = Tables<"student_accommodation_history">;
export type NewStudentAccommodationHistory = TablesInsert<"student_accommodation_history">;
export type UpdateStudentAccommodationHistory = TablesUpdate<"student_accommodation_history">;