import { Tables, TablesInsert, TablesUpdate } from "@/app/types/database.types";

export type Application = Tables<"application">;
export type NewApplication = TablesInsert<"application">;
export type UpdateApplication = TablesUpdate<"application">;
