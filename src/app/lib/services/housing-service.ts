import { housingData } from "@/app/lib/data/housing-data";
import { Housing, HousingWithRooms } from "@/models/housing";
import { validateAction, validateOwnership } from "./authorization-service";
import { AppAction } from "../models/permissions";

const addHousing = async (HousingDetail: Housing): Promise<Housing | null> => {
	try {
		await validateAction(AppAction.CREATE_HOUSING);

		const housingDetail = await housingData.create(HousingDetail);

		if (!housingDetail) return null;

		return housingDetail;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

// getProfile - INPUT: userId | OUTPUT: user (if found), null/error (if not)
const getHousing = async (housingId: number): Promise<Housing | null> => {
	try {
		const housingDetail = await housingData.findById(housingId);

		if (!housingDetail) return null;

		return housingDetail;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

const getAllHousing = async (): Promise<Housing[] | null> => {
	try {
		const housingDetail = await housingData.findAll();

		if (!housingDetail) return null;

		return housingDetail;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

const updateHousing = async (
	housingId: number,
	housingDetail: Partial<Housing>,
): Promise<Housing | null> => {
	try {
		// rbac
		await validateAction(AppAction.UPDATE_HOUSING);

		// obac
		const currentHousing = await housingData.findById(housingId);
		if (currentHousing) {
			await validateOwnership(currentHousing.landlord_account_number);
		}

		const { housing_id, ...allowedUpdates } = housingDetail;
		allowedUpdates;

		console.log(allowedUpdates);
		const updatedHousing = await housingData.update(
			housingId,
			allowedUpdates,
		);

		if (!updatedHousing) return null;

		return updatedHousing;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Failed to update housing");
	}
};

const deactivateHousing = async (
	housingId: number,
): Promise<Housing | null> => {
	try {
		const housing = await housingData.findById(housingId);
		if (!housing) {
			throw new Error("Housing record not found or already deactivated.");
		}

		/**
		 * TODO: Integration Task
		 * Once 'room-delete' PR is merged,
		 * add cascading soft delete for rooms of housing
		 */

		const deactivatedHousing = await housingData.deactivate(housingId);
		return deactivatedHousing ?? null;
	} catch (error: any) {
		if (error.message.includes("not found")) {
			throw error;
		}

		console.error("Service Error (removeHousing): ", error.message);
		throw new Error(
			"Failed to deactivate housing record due to a system error.",
		);
	}
};

const getHousingCount = async (): Promise<number | null> => {
	try {
		const housingCount = await housingData.countAllHousing();
		if (!housingCount) return null;

		return housingCount;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
};

// fetching all housing with all rooms linked to respective housing
const getAllHousingWithRooms = async (): Promise<HousingWithRooms[] | null> => {
	try {
		const housings = await housingData.findAllWithRooms();
		if (!housings) return null;
		return housings;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Failed to fetch housing with rooms");
	}
};
// fetching all rooms linked to specific housing
const getHousingWithRooms = async (
	housingId: number,
): Promise<HousingWithRooms | null> => {
	try {
		const housing = await housingData.findWithRooms(housingId);
		if (!housing) return null;

		// obac
		await validateOwnership(housing.landlord_account_number);

		return housing;
	} catch (error) {
		console.error("Error: ", error);
		throw error;
	}
};

const uploadHousingImage = async (
	housingId: number,
	file: File,
): Promise<Housing | null> => {
	try {
		return await housingData.uploadHousingImage(housingId, file);
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Failed to upload housing image");
	}
};

export const housingService = {
	addHousing,
	getHousing,
	getAllHousing,
	getHousingCount,
	getAllHousingWithRooms,
	getHousingWithRooms,
	uploadHousingImage,
	updateHousing,
	deactivateHousing,
};
