

import { getApplicationStats } from "@/app/lib/data/application-data";

const getDashboardStats = async () => {
  try {
    const stats = await getApplicationStats()
    return stats
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch application stats")
  }
}

export const applicationService = {
  getDashboardStats
}