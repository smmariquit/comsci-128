import { createManager } from "../data/manager-data";
import { NewUser } from "../models/user";

const addManager = async (
  userDetails: NewUser, 
  password: string,
  managerType: "Landlord" | "Housing Administrator"
): Promise<any> => {
  try {
    // Use your existing createManager function
    const manager = await createManager(userDetails, password, managerType);
    return manager;
  } catch (error) {
    console.error("Error creating manager: ", error);
    throw error;
  }
};