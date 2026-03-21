import { Tables, TablesInsert, TablesUpdate } from "@/app/types/database.types";

// Define Housing record based on DB schema
export type Housing = Tables<"housing">;
export type HousingInsert = TablesInsert<"housing">;
export type HousingUpdate = TablesUpdate<"housing">;