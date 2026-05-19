import { applicationData } from "@/app/lib/data/application-data";
import type { Database } from "@/app/types/database.types";

type ApplicationStatus = Database["public"]["Enums"]["ApplicationStatus"];

import { accommodationHistoryData } from "@/lib/data/accommodation-history-data";
import { AppAction } from "../models/permissions";
import { createAuditLog } from "./audit-log-service";
import { validateAction, validateOwnership } from "./authorization-service";
import { sendApplicationStatusEmail } from "./email-service";

function formatStudentName(user?: {
  first_name?: string | null;
  last_name?: string | null;
  middle_name?: string | null;
}): string {
  if (!user) return "";
  const first = user.first_name?.trim() ?? "";
  const last = user.last_name?.trim() ?? "";
  const full = `${first} ${last}`.trim();
  return full;
}

const getDashboardStats = async (managerAccountNumber: number) => {
  try {
    const stats =
      await applicationData.getApplicationStats(managerAccountNumber);
    return stats;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to fetch application stats");
  }
};

const getApplications = async () => {
  try {
    const applications =
      await applicationData.getApplicationsWithStudentDetails();
    if (!applications) return [];
    return applications;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to fetch applications");
  }
};

const getApplicationDetail = async (applicationId: number) => {
  try {
    const application =
      await applicationData.getApplicationDetailById(applicationId);
    if (!application) return null;
    return application;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to fetch application detail");
  }
};

const getApplicationDocuments = async (applicationId: number) => {
  try {
    const documents =
      await applicationData.getDocumentsByApplicationId(applicationId);
    if (!documents) return [];
    return documents;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to fetch application documents");
  }
};

const updateApplicationStatus = async (
  applicationId: number,
  status: ApplicationStatus,
) => {
  try {
    // rbac
    await validateAction(AppAction.UPDATE_APPLICATION_STATUS);

    // obac
    const appDetail =
      await applicationData.getApplicationDetailById(applicationId);

    console.log("appDetail: ", JSON.stringify(appDetail, null, 2));

    if (appDetail?.landlord_account_number) {
      await validateOwnership(appDetail.landlord_account_number);
    }

    const updated = await applicationData.update(applicationId, {
      application_status: status,
    });
    if (!updated) return null;

    const landlordAccountNumber = appDetail?.landlord_account_number ?? null;
    const student = appDetail?.student as any;
    const studentAccountNumber = student?.account_number ?? null;

    if (landlordAccountNumber && studentAccountNumber) {
      const studentUser = student?.user;
      const studentName = formatStudentName(studentUser);
      const label = studentName || `Student ${studentAccountNumber}`.trim();
      await createAuditLog(
        studentAccountNumber,
        "",
        "Update Application Status",
        `Application ${applicationId} status set to ${status} for ${label}`,
        landlordAccountNumber,
      );

      // Send status update email notification to student asynchronously
      const studentEmail = studentUser?.account_email;
      if (studentEmail && status) {
        const housingName =
          appDetail?.housing_name || "your housing application";
        sendApplicationStatusEmail(
          studentEmail,
          studentName || "Student",
          housingName,
          status as any,
        );
      }
    }

    return updated;
  } catch (error) {
    console.error("Error: ", error);
    throw error;
  }
};

const assignApplicantToRoom = async (
  applicationId: number,
  roomId: number,
  studentAccountNumber: number,
  moveoutDate: string,
) => {
  try {
    // rbac
    await validateAction(AppAction.ASSIGN_ROOM);

    const appDetail =
      await applicationData.getApplicationDetailById(applicationId);

    const updated = await applicationData.assignRoomToApplication(
      applicationId,
      roomId,
    );
    if (!updated) throw new Error("Failed to assign room to application.");

    await accommodationHistoryData.createTenantRecord(
      studentAccountNumber,
      roomId,
      moveoutDate,
    );

    const landlordAccountNumber = appDetail?.landlord_account_number ?? null;
    if (landlordAccountNumber) {
      const student = appDetail?.student as any;
      const studentUser = student?.user;
      const studentName = formatStudentName(studentUser);
      const label = studentName || `Student ${studentAccountNumber}`;
      const housingLabel = appDetail?.housing_name || "housing";
      await createAuditLog(
        studentAccountNumber,
        "",
        "Assign Room",
        `Assigned ${label} to room ${roomId} for ${housingLabel}`,
        landlordAccountNumber,
      );
    }

    return { success: true };
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to assign applicant to room.");
  }
};

const getApprovedUnassignedByHousingName = async (housingName: string) => {
  try {
    const applications =
      await applicationData.getApprovedUnassignedByHousingName(housingName);
    return applications;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to fetch approved unassigned applications.");
  }
};

const getApplicationsByLandlord = async (landlordAccountNumber: number) => {
  try {
    const applications = await applicationData.getByLandlord(
      landlordAccountNumber,
    );
    if (!applications) return [];
    return applications;
  } catch (error) {
    console.error("Error: ", error);
    throw new Error("Failed to fetch applications");
  }
};
export const applicationService = {
  getDashboardStats,
  getApplications,
  getApplicationDetail,
  getApplicationDocuments,
  updateApplicationStatus,
  assignApplicantToRoom,
  getApprovedUnassignedByHousingName,
  getApplicationsByLandlord,
};
