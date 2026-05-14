import { housingAdminData } from "@/app/lib/data/housing-admin-data";
import { NewUser } from "@/models/user";
import { NewManager } from "@/models/manager";
import { createAuditLog } from "./audit-log-service";

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

const addHousingAdmin = async (userDetails: NewUser, managerDetails: NewManager) => {
    try {
        const result = await housingAdminData.create(userDetails, managerDetails);
        if (result?.error) {
            throw new Error(result.error.message || "Failed to add housing admin.");
        }

        if (result?.account_number) {
            const userName = formatUserName(userDetails);
            const label = userName || userDetails.account_email || "Unknown user";
            await createAuditLog(
                result.account_number,
                userName,
                "Update User Role",
                `User ${label} promoted to Housing Admin`,
            );
        }
        return result;
    } catch (error) {
        console.error("Error adding housing admin:", error);
        throw new Error("Failed to add housing admin.");
    }
};

export const housingAdminService = {
  addHousingAdmin,
};
