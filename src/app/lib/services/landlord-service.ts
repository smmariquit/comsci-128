import {
	getAllHousingAdmins,
	getGrossRevenueByLandlord,
	getHousingAdminById,
	getTotalPropertiesByLandlord,
	getTotalRoomsByLandlord,
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

const _fetchTotalRoomsByLandlord = async (accountNumber: number) => {
  
	try {
		if (!Number.isInteger(accountNumber) || accountNumber <= 0) {
			throw new Error("Invalid landlord account number.");
		}
		const result = await getTotalRoomsByLandlord(accountNumber);
    
		if (result.error) {
			throw new Error(result.error.message || "Failed to count properties.");
		}
    
		return result.data ?? 0;
	} catch (_error: unknown) {
  
		if (result.error) {
			throw new Error(result.error.message || "Failed to count rooms."); 
    }
};

const fetchTotalPropertiesByLandlord = async (accountNumber: number) => {

	try {
		if (!Number.isInteger(accountNumber) || accountNumber <= 0) {
			throw new Error("Invalid landlord account number.");
		}
		const result = await getTotalPropertiesByLandlord(accountNumber);
		if (result.error) {
			throw new Error(result.error.message || "Failed to count properties.");
		}

		return result.data ?? 0;
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			error.message === "Invalid landlord account number."
		) {
			throw error;
		}

		console.error("Error counting properties by landlord:", error);
		throw new Error("Failed to count properties by landlord.");
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

const fetchGrossRevenueByLandlord = async (accountNumber: number) => {
	try {
		if (!Number.isInteger(accountNumber) || accountNumber <= 0) {
			throw new Error("Invalid landlord account number.");
		}

		const result = await getGrossRevenueByLandlord(accountNumber);
		if (result.error) {
			throw new Error(
				result.error.message || "Failed to calculate gross revenue.",
			);
		}

		return result.data ?? 0;
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			error.message === "Invalid landlord account number."
		) {
			throw error;
		}

		console.error("Error calculating gross revenue:", error);
		throw new Error("Failed to calculate gross revenue.");
	}
};

export const _landlordService = {
	fetchAllHousingAdmins,
	fetchGrossRevenueByLandlord,
	fetchHousingAdminById,
	fetchTotalRoomsByLandlord: _fetchTotalRoomsByLandlord,
	fetchTotalPropertiesByLandlord,
	fetchTotalTenantsByLandlord,
};
