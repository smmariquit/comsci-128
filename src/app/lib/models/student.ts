import type {
	Tables,
	TablesInsert,
	TablesUpdate,
} from "@/app/types/database.types";
import { NewUser, User } from "@/models/user";
import { NewStudentAcademic, StudentAcademic } from "@/models/student_academic";

export type Student = Tables<"student">;
export type NewStudent = TablesInsert<"student">;
export type UpdateStudent = TablesUpdate<"student">;

export type StudentProfile = Omit<User, "password" | "is_deleted"> & {
	student: (Omit<Student, "is_deleted"> & {
		student_academic: StudentAcademic[];
	})[];
};
export type NewStudentProfile = Omit<NewUser, "password" | "is_deleted"> & {
	student: Omit<NewStudent, "student_number" | "is_deleted"> & {
		student_academic: Partial<NewStudentAcademic>;
	};
};
