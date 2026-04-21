

import { 
  applicationData
} from "@/app/lib/data/application-data";

import { accommodationHistoryData } from "@/lib/data/accommodation-history-data";

const getDashboardStats = async () => {
  try {
    const stats = await applicationData.getApplicationStats()
    return stats
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch application stats")
  }
}

const getApplications = async () => {
  try {
    const applications = await applicationData.getApplicationsWithStudentDetails()
    if (!applications) return []
    return applications
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch applications")
  }
}

const getApplicationDetail = async (applicationId: number) => {
  try {
    const application = await applicationData.getApplicationDetailById(applicationId)
    if (!application) return null
    return application
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch application detail")
  }
}

const getApplicationDocuments = async (applicationId: number) => {
  try {
    const documents = await applicationData.getDocumentsByApplicationId(applicationId)
    if (!documents) return []
    return documents
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch application documents")
  }
}

const updateApplicationStatus = async (
  applicationId: number,
  status: "Approved" | "Rejected" | "Pending Manager Approval" | "Pending Admin Approval" | "Cancelled"
) => {
  try {
    const updated = await applicationData.update(applicationId, { application_status: status })
    if (!updated) return null
    return updated
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to update application status")
  }
}

const assignApplicantToRoom = async (
  applicationId: number,
  roomId: number,
  studentAccountNumber: number,
  moveoutDate: string
) => {
  try {

    const updated = await applicationData.assignRoomToApplication(applicationId, roomId)
    if (!updated) throw new Error("Failed to assign room to application.")

    await accommodationHistoryData.createTenantRecord(studentAccountNumber, roomId, moveoutDate)

    return { success: true }
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to assign applicant to room.")
  }
}

export const applicationService = {
  getDashboardStats,
  getApplications,
  getApplicationDetail,      
  getApplicationDocuments, 
  updateApplicationStatus,
  assignApplicantToRoom
}