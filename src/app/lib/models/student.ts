import type {
	Tables,
	TablesInsert,
	TablesUpdate,
} from "@/app/types/database.types";
import { User } from "@/models/user";
import { StudentAcademic } from "@/models/student_academic";

export type Student = Tables<"student">;
export type NewStudent = TablesInsert<"student">;
export type UpdateStudent = TablesUpdate<"student">;

export type StudentProfile = Omit<User, "password" | "is_deleted"> & {
	student: (Student & {
		student_academic: StudentAcademic[];
	})[];
};
