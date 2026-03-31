import { NewUser } from "@/models/user";
import { createManager } from "../data/manager-data";
import { createLandlord} from "../data/landlord-data";

export const addLandlord = async (
  userDetails: NewUser,
  password: string
): Promise<any> => {
  try {
    // Use your existing createLandlord function
    const landlord = await createLandlord(userDetails, password);
    return landlord;
  } catch (error) {
    console.error("Error creating landlord: ", error);
    throw error;
  }
};