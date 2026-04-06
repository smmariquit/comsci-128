import { User } from "@/models/user";
import { getAllLandlords } from "../data/landlord-data";
import { getAllHousingAdmins } from "../data/housing_admin";

type ServiceResponse<T> = { data?: T; error?: string };

const getAllManagers = async (): Promise<User[] | null> => {  // 👈 fixed
    try {
        const { data: landlordData } = await getAllLandlords();
        const { data: housingAdminData } = await getAllHousingAdmins();

        if (!landlordData || !housingAdminData) return [];

        // extract each user object in landlord/housingadmin
        const allProfiles = [...landlordData, ...housingAdminData]
            .map((profile: any) => profile.manager?.user)
            .filter(Boolean);

        return allProfiles;
    } catch (error) {
        console.error("Error: ", error);
        throw new Error("Error");
    }
};

export const managerService = {
    getAllManagers
};