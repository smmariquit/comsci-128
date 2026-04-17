import { studentData } from "@/data/student-data";
import { StudentProfile } from "@/models/student";

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

async function getManagerProfile() {
	// TODO: implement retrieving the manager profile
	throw new Error("getManagerProfile not implemented");
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
