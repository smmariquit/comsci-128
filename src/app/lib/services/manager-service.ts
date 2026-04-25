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
>>>>>>> 28abcf0e34af61c37f9cb8e87d05188697d701ea

   
        // extract and combine nested user object  
<<<<<<< HEAD
        return [...(landlord ?? []), ...(housingAdmin?? [])]
=======
        return [...(landlordDataResult ?? []), ...(housingAdminDataResult ?? [])]
>>>>>>> 28abcf0e34af61c37f9cb8e87d05188697d701ea
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
>>>>>>> 28abcf0e34af61c37f9cb8e87d05188697d701ea
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