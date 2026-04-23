import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/types/database.types";

export type Landlord = Tables<"landlord">;
export type NewLandlord = TablesInsert<"landlord">;
export type UpdateLandlord = TablesUpdate<"landlord">;