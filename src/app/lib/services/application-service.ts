

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

const getApplicationDetail = async (applicationId: number) => {
  try {
    const application = await getApplicationDetailById(applicationId)
    if (!application) return null
    return application
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch application detail")
  }
}

const getApplicationDocuments = async (applicationId: number) => {
  try {
    const documents = await getDocumentsByApplicationId(applicationId)
    if (!documents) return []
    return documents
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch application documents")
  }
}

export const applicationService = {
  getDashboardStats,
  getApplications,
  getApplicationDetail,      
  getApplicationDocuments, 
}