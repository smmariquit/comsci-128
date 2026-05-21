import { NewUser } from "@/models/user";
import { landlordData } from "@/app/lib/data/landlord-data";
import { NewManager } from "@/models/manager";
import { createAuditLog } from "./audit-log-service";
import { userService } from "./user-service";

function formatUserName(user: {
  first_name?: string | null;
  last_name?: string | null;
  account_email?: string | null;
}): string {
  const first = user.first_name?.trim() ?? "";
  const last = user.last_name?.trim() ?? "";
  const full = `${first} ${last}`.trim();
  return full || user.account_email?.trim() || "";
}

const addLandlord = async (
  accountNumber: number,
  managerDetails: NewManager,
): Promise<NewManager | null> => {
  try {
    const landlord = await landlordData.create(accountNumber, managerDetails);

    if (!landlord) return null;
    const userDetails = await userService.getUser(accountNumber);

    const userName = `${userDetails!.first_name} ${userDetails!.last_name}`;

    if (landlord && userDetails) {
      const userName = `${userDetails.first_name} ${userDetails.last_name}`;

      await createAuditLog(
        accountNumber,
        userName,
        "Update User Role",
        `${userName} updated role from student to landlord`,
        null,
      );
    }
    return landlord;
  } catch (error: any) {
    console.error("Error adding landlord:", error);
    console.error("Error message:", error.message);
    throw new Error(`Failed to add landlord: ${error.message}`);
  }
};

const fetchAllHousingAdmins = async () => {
  try {
    const result = await landlordData.getAll();
    if (result.error) {
      throw new Error(
        result.error.message || "Failed to fetch housing admins.",
      );
    }

    return result.data ?? [];
  } catch (error) {
    console.error("Error fetching housing admins:", error);
    throw new Error("Failed to fetch housing admins.");
  }
};

const fetchHousingAdminById = async (accountNumber: number) => {
  try {
    const result = await landlordData.getById(accountNumber);
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
    const result = await landlordData.getTotalRoomsManaged(accountNumber);

    if (!result) {
      throw new Error("Failed to count properties.");
    }

    return result ?? 0;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.message === "Invalid landlord account number."
    ) {
      throw error;
    }

    console.error("Error counting rooms by landlord:", error);
    throw new Error("Failed to count rooms.");
  }
};

const fetchTotalPropertiesByLandlord = async (accountNumber: number) => {
  try {
    if (!Number.isInteger(accountNumber) || accountNumber <= 0) {
      throw new Error("Invalid landlord account number.");
    }
    const result = await landlordData.getTotalProperties(accountNumber);
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

    const result = await landlordData.getTotalTenantsManaged(accountNumber);
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

    const result = await landlordData.getGrossRevenue(accountNumber);
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

export const landlordService = {
  addLandlord,
  fetchAllHousingAdmins,
  fetchGrossRevenueByLandlord,
  fetchHousingAdminById,
  fetchTotalRoomsByLandlord: _fetchTotalRoomsByLandlord,
  fetchTotalPropertiesByLandlord,
  fetchTotalTenantsByLandlord,
};
