

import { getApplicationStats, getApplicationsWithStudentDetails, 
  getApplicationDetailById, getDocumentsByApplicationId 

} from "@/app/lib/data/application-data";

const getDashboardStats = async () => {
  try {
    const stats = await getApplicationStats()
    return stats
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch application stats")
  }
}

const getApplications = async () => {
  try {
    const applications = await getApplicationsWithStudentDetails()
    if (!applications) return []
    return applications
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch applications")
  }
}

export const applicationService = {
  getDashboardStats,
  getApplications,
};