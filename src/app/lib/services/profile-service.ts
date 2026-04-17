import { studentData } from "@/data/student-data";
import { StudentProfile } from "@/models/student";
import { ManagerProfile } from "../models/manager";
import { managerData } from "../data/manager-data";

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

async function updateStudentProfile(profileData: unknown) {
	// TODO: implement updating the student profile
	throw new Error("updateStudentProfile not implemented");
}

async function updateManagerProfile(profileData: unknown) {
	// TODO: implement updating the manager profile
	throw new Error("updateManagerProfile not implemented");
}

export const profileAction = {
	getStudentProfile,
	getManagerProfile,
	updateStudentProfile,
	updateManagerProfile,
};
