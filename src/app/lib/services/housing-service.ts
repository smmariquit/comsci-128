import { createHousing, findAllHousing, updateHousing } from "@/data/housing";
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

export const modifyHousing = async (
	housingId: number,
	housingDetail: Partial<Housing>,
): Promise<Housing | null> => {
	try {
		const { housing_id, ...allowedUpdates } = housingDetail;
		allowedUpdates;

		console.log(allowedUpdates);
		const updatedHousing = await updateHousing(housingId, allowedUpdates);

		if (!updatedHousing) return null;

		return updatedHousing;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Failed to update housing");
	}
};
