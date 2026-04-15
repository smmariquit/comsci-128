import { NewUser } from "@/models/user";
import {
	getAllHousingAdmins,
	getHousingAdminById,
	getTotalTenantsByLandlord,
} from "@/app/lib/data/landlord-data";

const fetchAllHousingAdmins = async () => {
	try {
		const result = await getAllHousingAdmins();
		if (result.error) {
			throw new Error(result.error.message || "Failed to fetch housing admins.");
		}

		return result.data ?? [];
	} catch (error) {
		console.error("Error fetching housing admins:", error);
		throw new Error("Failed to fetch housing admins.");
	}
};

const fetchHousingAdminById = async (accountNumber: number) => {
	try {
		const result = await getHousingAdminById(accountNumber);
		if (result.error) {
			if (result.error.code === "PGRST116") {
				return null;
			}

			throw new Error(result.error.message || "Failed to fetch housing admin.");
		}

		return result.data;
	} catch (error) {
		console.error("Error fetching housing admin:", error);
		throw new Error("Failed to fetch housing admin.");
	}
};

const fetchTotalTenantsByLandlord = async (accountNumber: number) => {
	try {
		if (!Number.isInteger(accountNumber) || accountNumber <= 0) {
			throw new Error("Invalid landlord account number.");
		}

		const result = await getTotalTenantsByLandlord(accountNumber);
		if (result.error) {
			throw new Error(result.error.message || "Failed to count tenants.");
		}

		return result.data ?? 0;
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			error.message === "Invalid landlord account number."
		) {
			throw error;
		}

		console.error("Error counting tenants by landlord:", error);
		throw new Error("Failed to count tenants by landlord.");
	}
};

export const landlordService = {
	fetchAllHousingAdmins,
	fetchHousingAdminById,
	fetchTotalTenantsByLandlord,
};
