import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/types/database.types";

export type StudentAccommodationHistory =
  Tables<"student_accommodation_history">;
export type NewStudentAccommodationHistory =
  TablesInsert<"student_accommodation_history">;
export type UpdateStudentAccommodationHistory =
  TablesUpdate<"student_accommodation_history">;
