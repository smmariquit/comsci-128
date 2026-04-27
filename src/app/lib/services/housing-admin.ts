import { housingAdminData } from "@/app/lib/data/housing-admin-data";
import { NewUser } from "@/models/user";
import { NewManager } from "@/models/manager";

const addHousingAdmin = async (account_number: number, managerDetails: NewManager) => {
    try {
        const result = await housingAdminData.create(account_number, managerDetails);
        if (result?.error) {
            throw new Error(result.error.message || "Failed to add housing admin.");
        }
        return result;
    } catch (error) {
        console.error("Error adding housing admin:", error);
        throw new Error("Failed to add housing admin.");
    }
};

export const housingAdminService = {
    addHousingAdmin
};