import { User, NewUser } from "@/models/user";
import { landlordData } from "../data/landlord-data";
import { housingAdminData } from "../data/housing-admin-data";
import { managerData } from "../data/manager-data";

type ServiceResponse<T> = { data?: T; error?: string };

const getAllManagers = async (): Promise<User[] | null> => {
    try {
        const { data: landlordDataResult } = await landlordData.getAll();
        const { data: housingAdminDataResult } = await housingAdminData.getAll();

   
        // extract and combine nested user object  
        return [...(landlordDataResult ?? []), ...(housingAdminDataResult ?? [])]
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
            const managerCount = await managerData.getCount();
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