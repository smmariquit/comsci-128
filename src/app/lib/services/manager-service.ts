import { User, NewUser } from "@/models/user";
import { getAllLandlords } from "../data/landlord-data";
import { getAllHousingAdmins } from "../data/housing_admin";
import { createManager } from "../data/manager-data";

type ServiceResponse<T> = { data?: T; error?: string };

const getAllManagers = async (): Promise<User[] | null> => {
    try {
        const { data: landlordData } = await getAllLandlords();
        const { data: housingAdminData } = await getAllHousingAdmins();

        // extract and combine nested user object  
        return [...(landlordData ?? []), ...(housingAdminData ?? [])]
            .map((profile: any) => ({
                ...profile.manager?.user,
                role: profile.manager?.manager_type,
            }))
            .filter((profile) => profile.account_number);
    } catch (error) {
        console.error("Error fetching managers:", error);
        throw new Error("Failed to fetch managers");
    }
};

export const managerService = {
    getAllManagers
};