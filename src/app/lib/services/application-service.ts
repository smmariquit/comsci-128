

import { applicationData } from "@/app/lib/data/application-data";
import { Database } from "@/app/types/database.types";

type ApplicationStatus = Database["public"]["Enums"]["ApplicationStatus"];

import { accommodationHistoryData } from "@/lib/data/accommodation-history-data";
import { validateAction, validateOwnership } from "./authorization-service";
import App from "next/app";
import { AppAction } from "../models/permissions";

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
  status: ApplicationStatus
) => {
  try {
    // rbac
    await validateAction(AppAction.UPDATE_APPLICATION_STATUS);

    // obac
    const appDetail = await applicationData.getApplicationDetailById(applicationId);
    if (appDetail?.landlord_account_number) {
      await validateOwnership(appDetail.landlord_account_number);
    }

    const updated = await applicationData.update(applicationId, { application_status: status })
    if (!updated) return null
    return updated
  } catch (error) {
    console.error("Error: ", error)
    throw error;
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

const getApprovedUnassignedByHousingName = async (housingName: string) => {
  try {
    const applications = await applicationData.getApprovedUnassignedByHousingName(housingName)
    return applications
  } catch (error) {
    console.error("Error: ", error)
    throw new Error("Failed to fetch approved unassigned applications.")
  }
}

export const applicationService = {
  getDashboardStats,
  getApplications,
  getApplicationDetail,      
  getApplicationDocuments, 
  updateApplicationStatus,
  assignApplicantToRoom,
  getApprovedUnassignedByHousingName
}