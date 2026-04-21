import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/types/database.types";

export type Student = Tables<"student">;
export type NewStudent = TablesInsert<"student">;
export type UpdateStudent = TablesUpdate<"student">;
