import type { NewUser, User } from "../models/user";
import type { NewStudent, Student } from "../models/student";
import type { NewStudentAcademic } from "@/models/student_academic";
import { studentData } from "../data/student-data";
import { userService } from "@/services/user-service";
import { createAuditLog } from "./audit-log-service";

function formatUserName(user: {
    first_name?: string | null;
    last_name?: string | null;
    account_email?: string | null;
}): string {
    const first = user.first_name?.trim() ?? "";
    const last = user.last_name?.trim() ?? "";
    const full = `${first} ${last}`.trim();
    return full || user.account_email?.trim() || "";
}

const buildDefaultStudentDetails = (): NewStudent => ({
    student_number: Math.floor(Math.random() * 1000000),
    housing_status: "Not Assigned",
    emergency_contact_name: null,
    emergency_contact_number: null,
    emergency_contact_relationship: null,
});

const buildDefaultStudentAcademicDetails = (): NewStudentAcademic => ({
    degree_program: "",
    standing: "Freshman",
    status: "Active",
});

export const addStudent = async (
    userDetails: NewUser,
    studentDetails?: NewStudent,
    studentAcademicDetails?: NewStudentAcademic,
): Promise<{ user: User; student: Student }> => {
    try {
        const createdUser = await userService.addUser(userDetails);
        const accountNumber = createdUser.account_number;
        const mergeStudentDetails = {
            ...buildDefaultStudentDetails(),
            ...(studentDetails ?? {}),
        } as NewStudent;
        const mergeStudentAcademicDetails = {
            ...buildDefaultStudentAcademicDetails(),
            ...(studentAcademicDetails ?? {}),
        } as NewStudentAcademic;

        const student = await studentData.create(
            accountNumber,
            mergeStudentDetails,
            mergeStudentAcademicDetails,
        );

        const userName = formatUserName(createdUser);
        const label = userName || createdUser.account_email || "Unknown user";
        await createAuditLog(
            accountNumber,
            userName,
            "Update User Role",
            `User ${label} assigned Student role`,
        );
        return { user: createdUser, student };
    } catch (error) {
        console.error("Error creating student:", error);
        throw error;
    }
};

export const createStudentProfile = async (
    accountNumber: number,
    studentDetails?: NewStudent,
    studentAcademicDetails?: NewStudentAcademic,
): Promise<Student> => {
    const mergeStudentDetails = {
        ...buildDefaultStudentDetails(),
        ...(studentDetails ?? {}),
    } as NewStudent;
    const mergeStudentAcademicDetails = {
        ...buildDefaultStudentAcademicDetails(),
        ...(studentAcademicDetails ?? {}),
    } as NewStudentAcademic;

    const student = await studentData.create(
        accountNumber,
        mergeStudentDetails,
        mergeStudentAcademicDetails,
    );

    await createAuditLog(
        accountNumber,
        "",
        "Update User Details",
        `Student profile created for account ${accountNumber}`,
    );
    return student;
};