import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/types/database.types";
import type { Room } from "@/models/room";

// Define Housing record based on DB schema
export type Housing = Tables<"housing">;
export type HousingWithRooms = Housing & { room: Room[] };
export type HousingInsert = TablesInsert<"housing">;
export type HousingUpdate = TablesUpdate<"housing">;
