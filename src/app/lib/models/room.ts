import type {
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/types/database.types";

// Define Room record based on DB schema
export type Room = Tables<"room">;
export type RoomWithParentHousing = Room & {
  housing: {
    housing_name: string;
    housing_address: string;
  };
};
export type RoomInsert = TablesInsert<"room">;
export type RoomUpdate = TablesUpdate<"room">;
export type RoomType = Enums<"RoomType">;
