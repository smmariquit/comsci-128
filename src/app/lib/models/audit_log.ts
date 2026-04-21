import { Tables, TablesInsert, Enums } from "@/app/types/database.types";

export type AuditLog = Tables<"audit_log">;
export type NewAuditLog = TablesInsert<"audit_log">;
export type Role = Enums<"UserType">;