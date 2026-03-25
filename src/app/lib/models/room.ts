import {
	Enums,
	Tables,
	TablesInsert,
	TablesUpdate,
} from "@/app/types/database.types";

// Define Room record based on DB schema
export type Room = Tables<"room">;
export type RoomInsert = TablesInsert<"room">;
export type RoomUpdate = TablesUpdate<"room">;
export type RoomType = Enums<"RoomType">;
