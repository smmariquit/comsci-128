import { studentData } from "@/data/student-data";
import { NewStudentProfile, StudentProfile } from "@/models/student";
import { ManagerProfile, NewManagerProfile } from "../models/manager";
import { managerData } from "../data/manager-data";
import { userData } from "../data/user-data";

async function getStudentProfile(
	userId: number,
): Promise<StudentProfile | null> {
	try {
		const studentProfile = await studentData.findStudentProfileById(userId);
		if (!studentProfile) return null;

		return studentProfile;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
}

async function getManagerProfile(
	userId: number,
): Promise<ManagerProfile | null> {
	try {
		const managerProfile = await managerData.findManagerProfileById(userId);
		if (!managerProfile) return null;

		return managerProfile;
	} catch (error) {
		console.error("Error: ", error);
		throw new Error("Error");
	}
}

async function updateStudentProfile(
	userId: number,
	profileData: NewStudentProfile,
): Promise<StudentProfile | null> {
	try {
		const {
			student,
			account_number,
			account_email,
			user_type,
			...userUpdates
		} = profileData;

		const updatedUser = await userData.update(userId, userUpdates);
		if (!updatedUser) return null;

		console.log("Student data received:", student);
		if (student) {
			const { account_number, student_academic, ...studentDetails } =
				student;

			await studentData.updateStudent(userId, studentDetails);
			if (student_academic) {
				if (student_academic) {
					const { account_number, ...studentAcademicDetails } =
						student_academic;
					await studentData.updateAcademicDetails(
						userId,
						studentAcademicDetails,
					);
				}
			}
		}

		return await getStudentProfile(userId);
	} catch (error: any) {
		console.error("Error updating profile:", error.message);
		throw new Error("Failed to update profile");
	}
}

async function updateManagerProfile(
	userId: number,
	profileData: NewManagerProfile,
): Promise<ManagerProfile | null> {
	try {
		const {
			account_number,
			account_email,
			user_type,
			manager,
			...userUpdates
		} = profileData;

		const updatedUser = await userData.update(userId, userUpdates);
		if (!updatedUser) return null;

		if (manager) {
			const {
				account_number,
				manager_payment_details,
				...managerDetails
			} = manager;

			await managerData.update(userId, managerDetails);

			if (manager_payment_details) {
				const { account_number, ...paymentDetails } =
					manager_payment_details;

				await managerData.updatePaymentDetails(userId, paymentDetails);
			}
		}

		return await managerData.findManagerProfileById(userId);
	} catch (error: any) {
		console.error("Error updating manager profile:", error.message);
		throw new Error("Failed to update profile");
	}
}

export const profileAction = {
	getStudentProfile,
	getManagerProfile,
	updateStudentProfile,
	updateManagerProfile,
};
