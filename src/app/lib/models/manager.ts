import type {
	Tables,
	TablesInsert,
	TablesUpdate,
} from "@/app/types/database.types";

import { NewUser, User } from "@/models/user";

export type Manager = Tables<"manager">;
export type NewManager = TablesInsert<"manager">;
export type UpdateManager = TablesUpdate<"manager">;

export type ManagerPaymentDetails = Tables<"manager_payment_details">;
export type NewManagerPaymentDetails = TablesUpdate<"manager_payment_details">;

export type ManagerProfile = Omit<User, "password" | "is_deleted"> & {
	manager: Manager & {
		manager_payment_details: ManagerPaymentDetails[];
	};
};

export type NewManagerProfile = Omit<NewUser, "password" | "is_deleted"> & {
	manager: NewManager & {
		manager_payment_details: NewManagerPaymentDetails;
	};
};
