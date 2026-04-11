

import { accommodationHistoryData } from "@/app/lib/data/accommodation-history-data";

const getTenantsByHousingId = async (housingId: number) => {
  try {
    const tenants = await accommodationHistoryData.getCurrentTenantsByHousingId(housingId)
    if (!tenants) return []
    return tenants
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch tenants")
  }
}

const getTenantsByRoomId = async (roomId: number) => {
  try {
    const tenants = await accommodationHistoryData.getCurrentTenantsByRoomId(roomId)
    return tenants
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch tenants")
  }
}

export const accommodationHistoryService = {
  getTenantsByHousingId,
  getTenantsByRoomId
}