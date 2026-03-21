import { Tables, TablesInsert, TablesUpdate } from "@/app/types/database.types";

// Define Room record based on DB schema
export type Room = Tables<"housing">;
export type RoomInsert = TablesInsert<"housing">;
export type RoomUpdate = TablesUpdate<"housing">;
