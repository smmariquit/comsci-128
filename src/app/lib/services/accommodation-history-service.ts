

import { getCurrentTenantsByHousingId } from "@/app/lib/data/accommodation-history-data";

export const accommodationHistoryService = {
  getTenantsByHousingId: async (housingId: number) => {
    try {
      const tenants = await getCurrentTenantsByHousingId(housingId)
      if (!tenants) return []
      return tenants
    } catch (error) {
      console.error("Error: ", error)
      throw new Error("Failed to fetch tenants")
    }
  }
}