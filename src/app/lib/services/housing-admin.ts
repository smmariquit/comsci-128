import { housingAdminData } from "@/app/lib/data/housing-admin-data";
import { NewUser } from "@/models/user";
import { NewManager } from "@/models/manager";
import { createAuditLog } from "./audit-log-service";
import { userService } from "./user-service";

function formatUserName(user: {
    first_name?: string | null;
    last_name?: string | null;
    account_email?: string | null;
}): string {
    const first = user.first_name?.trim() ?? "";
    const last = user.last_name?.trim() ?? "";
    const full = `${first} ${last}`.trim();
    return full || user.account_email?.trim() || "";
}


const addHousingAdmin = async (account_number: number, managerDetails: NewManager) => {
    try {
        const result = await housingAdminData.create(account_number, managerDetails);
        if (result?.error) {
            throw new Error(result.error.message || "Failed to add housing admin.");
        }


    
        const userDetails = await userService.getUser(account_number);

        const userName = `${userDetails!.first_name} ${userDetails!.last_name}`;

        if (result && userDetails) {
        const userName = `${userDetails.first_name} ${userDetails.last_name}`;

        await createAuditLog(
            account_number,
            userName,
            "Update User Role",
            `${userName} updated role from student to housing admin`,
            null
        );
        }
        return result;
    } catch (error) {
        console.error("Error adding housing admin:", error);
        throw new Error("Failed to add housing admin.");
    }
};

const fetchAllHousingAdmins = async () => {
    try {
        const result = await housingAdminData.getAll();
        if (result?.error) {
            throw new Error(result.error.message || "Failed to fetch housing admin.");
        }
        return result;
    } catch (error) {
        console.error("Error fetching housing admin:", error);
        throw new Error("Failed to fetch housing admin.");
    }
}

export const housingAdminService = {
  addHousingAdmin,
  fetchAllHousingAdmins
};
