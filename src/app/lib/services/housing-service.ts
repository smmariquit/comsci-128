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
	housingId: Number,
	HousingDetail: Housing,
): Promise<Housing | null> => {
	try {
		const housingDetail = await updateHousing(housingId, HousingDetail);

		return housingDetail ?? null;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};
