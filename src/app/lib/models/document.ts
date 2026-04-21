import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/app/types/database.types";

export type Document = Tables<"document">;
export type NewDocument = TablesInsert<"document">;
export type UpdateDocument = TablesUpdate<"document">;
