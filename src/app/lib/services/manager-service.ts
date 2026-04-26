import { User, NewUser } from "@/models/user";
import { landlordData } from "../data/landlord-data";
import { housingAdminData } from "../data/housing-admin-data";
import { managerData } from "../data/manager-data";

type ServiceResponse<T> = { data?: T; error?: string };

const getAllManagers = async (): Promise<User[] | null> => {
    try {
<<<<<<< HEAD
        const { data : landlord} = await landlordData.getAll();
        const { data : housingAdmin } = await housingAdminData.getAll();
=======
        const { data: landlordDataResult } = await landlordData.getAll();
        const { data: housingAdminDataResult } = await housingAdminData.getAll();
>>>>>>> 00ed3308e8ef423b0a87bed02f4c5e9e85757c0e

   
        // extract and combine nested user object  
<<<<<<< HEAD
        return [...(landlord ?? []), ...(housingAdmin?? [])]
=======
        return [...(landlordDataResult ?? []), ...(housingAdminDataResult ?? [])]
>>>>>>> 00ed3308e8ef423b0a87bed02f4c5e9e85757c0e
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

const getManagerCount = async(): Promise<number | null> => {
    try {
<<<<<<< HEAD
            const managerCount = await managerData.getCount();
=======
            const managerCount = await managerData.countAllManager();
>>>>>>> 00ed3308e8ef423b0a87bed02f4c5e9e85757c0e
            if (!managerCount) return null;
            
            return managerCount; 
            
        } catch (error) {
            console.error("Error: ", error);
            throw new Error("Error");
    }
}

export const managerService = {
    getAllManagers,
    getManagerCount
};