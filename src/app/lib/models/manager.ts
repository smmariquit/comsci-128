import { Tables, TablesInsert, TablesUpdate } from "@/app/types/database.types";

export type Manager = Tables<"manager">;
export type NewManager = TablesInsert<"manager">;
export type UpdateManager = TablesUpdate<"manager">;