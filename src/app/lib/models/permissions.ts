import type { Tables, TablesInsert, TablesUpdate } from "@/app/types/database.types";

export type Permission = Tables<"permissions">;

export enum AppAction {
    APPLICATION_STATUS = "application_status",
    BILL_STATUS = "bill_status",
    AUTH_REGISTER = "auth_register",
    AUTH_LOGIN = "auth_login",
    CHANGE_AUTH_PASSWORD = "change_auth_password",
    DELETE_ACCOUNT = "delete_account",
    UPDATE_USER_ROLE = "update_user_role",
    UPDATE_USER_DETAILS = "update_user_details",
    SUBMIT_APPLICATION = "submit_application",
    UPDATE_APPLICATION_STATUS = "update_application_status",
    WITHDRAW_APPLICATION = "withdraw_application",
    CREATE_HOUSING = "create_housing",
    UPDATE_HOUSING = "update_housing",
    ASSIGN_ROOM = "assign_room",
    ASSIGN_BILL = "assign_bill",
    ISSUE_BILL_REFUND = "issue_bill_refund",
    UPDATE_BILL_STATUS = "update_bill_status",  
}

export type UserRole = "public" | "student" | "housing_admin" | "landlord" | "system_admin";
