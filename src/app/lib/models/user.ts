import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/types/database.types";

export type User = Tables<"user">;
export type NewUser = TablesInsert<"user">;
export type UpdateUser = TablesUpdate<"user">;
