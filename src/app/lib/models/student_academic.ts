import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/types/database.types";

export type StudentAcademic = Tables<"student_academic">;
export type NewStudentAcademic = TablesInsert<"student_academic">;
export type UpdateStudentAcademic = TablesUpdate<"student_academic">;
