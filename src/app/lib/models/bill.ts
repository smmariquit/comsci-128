import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/types/database.types";

export type Bill = Tables<"bill">;
export type NewBill = TablesInsert<"bill">;
export type UpdateBill = TablesUpdate<"bill">;
