import type {
	Tables,
	TablesInsert,
	TablesUpdate,
} from "@/app/types/database.types";

import { User } from "@/models/user";

export type Manager = Tables<"manager">;
export type NewManager = TablesInsert<"manager">;
export type UpdateManager = TablesUpdate<"manager">;

export type ManagerPaymentDetails = Tables<"manager_payment_details">;

export type ManagerProfile = Omit<User, "password" | "is_deleted"> & {
	manager: (Manager & {
		manager_payment_details: ManagerPaymentDetails[];
	})[];
};
