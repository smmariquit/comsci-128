import { createHousing, findAllHousing, deleteHousing, findHousingById } from "@/data/housing";
import { Housing } from "@/models/housing";

// getProfile - INPUT: userId | OUTPUT: user (if found), null/error (if not)
export const getHousing = async (): Promise<Housing[] | null> => {
	try {
		const housingDetail = await findAllHousing();

		if (!housingDetail) return null;

		return housingDetail;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

export const addHousing = async (
	HousingDetail: Housing,
): Promise<Housing | null> => {
	try {
		const housingDetail = await createHousing(HousingDetail);

		if (!housingDetail) return null;

		return housingDetail;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

export const removeHousing = async (housingId: number): Promise<Housing | null> => {
    try {
        const housing = await findHousingById(housingId.toString());
        if (!housing) {
            throw new Error("Housing record not found or already deactivated.");
        }

        /**
         * TODO: Integration Task
         * Once 'room-delete' PR is merged, 
         * add cascading soft delete for rooms of housing
         */

        const deactivatedHousing = await deleteHousing(housingId);
        return deactivatedHousing ?? null;
    } catch (error: any) {
        if (error.message.includes("not found")) {
            throw error; 
        }
        
        console.error("Service Error (removeHousing): ", error.message);
        throw new Error("Failed to deactivate housing record due to a system error.");
    }
};