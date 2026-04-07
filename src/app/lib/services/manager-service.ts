import { User } from "@/models/user";
import { getAllLandlords } from "../data/landlord-data";
import { getAllHousingAdmins } from "../data/housing_admin";

type ServiceResponse<T> = { data?: T; error?: string };

const getAllManagers = async (): Promise<User[] | null> => {  // 👈 fixed
    try {
        const { data: landlordData } = await getAllLandlords();
        const { data: housingAdminData } = await getAllHousingAdmins();

        // extract each user object in landlord/housingadmin and handle null case
        const allProfiles = [...(landlordData ?? []), ...(housingAdminData ?? [])]
    .map((profile: any) => ({
        ...profile.manager?.user,         // spread all user fields
        role: profile.manager?.manager_type // 👈 add manager_type as role
    }))
    .filter((profile) => profile.account_number); // filter out nulls
        return allProfiles;
    } catch (error) {
        console.error("Error: ", error);
        throw new Error("Error");
    }
};

export const managerService = {
    getAllManagers
};