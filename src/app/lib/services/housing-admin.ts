import { NewUser } from "@/models/user";
import { createManager } from "../data/manager-data";
import { createHousingAdmin } from "../data/housing_admin"; 

const addLandlord = async (
  userDetails: NewUser,
  password: string
): Promise<any> => {
  try {
    // Use your existing createLandlord function
    const landlord = await createHousingAdmin(userDetails, password);
    return landlord;
  } catch (error) {
    console.error("Error creating landlord: ", error);
    throw error;
  }
};