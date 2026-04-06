import { Tables, TablesInsert, TablesUpdate } from "@/app/types/database.types";
<<<<<<< HEAD

// Define Housing record based on DB schema
export type Housing = Tables<"housing">;
export type HousingInsert = TablesInsert<"housing">;
export type HousingUpdate = TablesUpdate<"housing">;
=======
import { Room } from "@/models/room";

// Define Housing record based on DB schema
export type Housing = Tables<"housing">;
export type HousingWithRooms = Housing & { room: Room[] };
export type HousingInsert = TablesInsert<"housing">;
export type HousingUpdate = TablesUpdate<"housing">;
>>>>>>> edb4d3bd3cec07198ecac0ed8601a56cdab552c4
