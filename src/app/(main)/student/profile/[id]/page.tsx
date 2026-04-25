"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import StudentNavBar from "../../_components/StudentNavBar";
import { StudentProfile } from "@/app/lib/models/student";

type StudentPayload = Omit<StudentProfile, "student"> & {
	student:
		| (StudentProfile["student"][number] & {
				student_academic: StudentProfile["student"][number]["student_academic"][number];
		  })
		| null;
};

export default function StudentProfilePage() {
	const { id } = useParams();
	const [student, setStudent] = useState<StudentPayload | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("Personal Information");

	useEffect(() => {
		async function fetchProfile() {
			try {
				const res = await fetch(`/api/student/profile/${id}`);
				const data = await res.json();

				const studentObj = Array.isArray(data.student)
					? (data.student[0] ?? null)
					: (data.student ?? null);
				const academicObj = studentObj
					? Array.isArray(studentObj.student_academic)
						? (studentObj.student_academic[0] ?? null)
						: (studentObj.student_academic ?? null)
					: null;

				setStudent({
					...data,
					student: studentObj
						? {
								...studentObj,
								student_academic: academicObj,
							}
						: null,
				} as StudentPayload);
			} catch (err) {
				console.error("Failed to load profile", err);
			} finally {
				setLoading(false);
			}
		}
		fetchProfile();
	}, [id]);

	const handleSave = async () => {
		try {
			const res = await fetch(`/api/student/profile/${id}`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },

				body: JSON.stringify(student),
			});

			if (res.ok) alert("All records updated successfully!");
		} catch (err) {
			alert("Error saving changes.");
		}
	};

	const updatePersonalInfo = (updates: Partial<StudentPayload>) => {
		setStudent((prev) => {
			if (!prev) return prev;
			return {
				...prev,
				...updates,
			};
		});
	};

	const updateStudentDetails = (updates: Record<string, any>) => {
		setStudent((prev) => {
			if (!prev || !prev.student) return prev;

			const current = prev.student;
			const updatedStudent = {
				...current,
				...updates,
			};

			return {
				...prev,
				student: updatedStudent,
			};
		});
	};

	const updateStudentAcademic = (updates: Record<string, any>) => {
		setStudent((prev) => {
			if (!prev || !prev.student) return prev;

			const currentStudent = prev.student;
			const currentAcademic = currentStudent.student_academic ?? null;
			if (!currentAcademic) return prev;

			const updatedAcademic = {
				...currentAcademic,
				...updates,
			};

			const updatedStudent = {
				...currentStudent,
				student_academic: updatedAcademic,
			};

			return {
				...prev,
				student: updatedStudent,
			};
		});
	};

	if (loading)
		return (
			<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20">
				<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#C9642A]"></div>
			</div>
		);

	const studentDetails = student?.student;
	const studentAcademic = studentDetails?.student_academic;

	return (
		<div className="flex flex-col min-h-screen bg-[#1C2632] font-[family-name:var(--font-geist-sans)]">
			<StudentNavBar path="Student Profile" userId={Number(id)} />

			{/* Main Content*/}
			<div className="mx-auto w-[90vw] flex-1 bg-[#EDE9DE] p-10 flex gap-12">
				{/* Left Card Sidebar */}
				<div className="w-1/3 bg-white/50 border border-[#E3AF64] rounded-[2rem] p-8 flex flex-col items-center shadow-sm">
					{/* Profile Circle */}
					<div className="w-32 h-32 bg-[#1C2632] rounded-full mb-6 flex items-center justify-center">
						<span className="text-[#EDE9DE] text-4xl font-bold">
							{student?.first_name?.[0]}
							{student?.last_name?.[0]}
						</span>
					</div>

					<h2 className="text-2xl font-bold text-[#1C2632] mb-1 text-center">
						{student?.first_name} {student?.last_name}
					</h2>
					<p className="text-[#567375] font-medium mb-10">
						{student?.account_email}
					</p>

					{/* Navigation Tabs */}
					<div className="w-full space-y-3 mb-12">
						{[
							"Personal Information",
							"Emergency Contact",
							"Academic Information",
						].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`w-full text-left px-5 py-3 rounded-xl transition-all duration-200 ${
									activeTab === tab
										? "bg-[#567375] text-white shadow-md"
										: "text-[#1C2632] hover:bg-[#E3AF64]/20"
								}`}
							>
								{tab}
							</button>
						))}
					</div>

					{/* Action Button */}
					<button
						onClick={handleSave}
						className="w-full bg-[#C9642A] text-white py-4 rounded-xl font-bold text-lg hover:brightness-110 transition-all shadow-lg active:scale-[0.98]"
					>
						Save changes
					</button>
				</div>

				{/* RIGHT FORM AREA */}
				<div className="flex-1 flex flex-col gap-6 pt-10">
					<h3 className="text-[#1C2632] text-xl font-bold border-b border-[#E3AF64] pb-2 mb-4">
						{activeTab}
					</h3>

					{activeTab === "Personal Information" && (
						<>
							<ProfileInput
								label="First Name"
								value={student?.first_name}
								onChange={(val: any) =>
									updatePersonalInfo({ first_name: val })
								}
							/>
							<ProfileInput
								label="Middle Name"
								value={student?.middle_name}
								onChange={(val: any) =>
									updatePersonalInfo({ middle_name: val })
								}
							/>
							<ProfileInput
								label="Last Name"
								value={student?.last_name}
								onChange={(val: any) =>
									updatePersonalInfo({ last_name: val })
								}
							/>
							<ProfileInput
								label="Email"
								value={student?.account_email}
								disabled
							/>
						</>
					)}

					{activeTab === "Emergency Contact" && (
						<>
							<ProfileInput
								label="Emergency Contact Name"
								value={studentDetails?.emergency_contact_name}
								onChange={(val: any) =>
									updateStudentDetails({
										emergency_contact_name: val,
									})
								}
							/>
							<ProfileInput
								label="Emergency Contact Number"
								value={studentDetails?.emergency_contact_number}
								onChange={(val: any) =>
									updateStudentDetails({
										emergency_contact_number: val,
									})
								}
							/>
							<ProfileInput
								label="Relationship"
								value={
									studentDetails?.emergency_contact_relationship
								}
								onChange={(val: any) =>
									updateStudentDetails({
										emergency_contact_relationship: val,
									})
								}
							/>
						</>
					)}

					{activeTab === "Academic Information" && (
						<>
							<ProfileInput
								label="Degree Program"
								value={studentAcademic?.degree_program}
								onChange={(val: string) =>
									updateStudentAcademic({
										degree_program: val,
									})
								}
							/>

							<ProfileSelect
								label="Standing"
								value={studentAcademic?.standing}
								options={[
									"Freshman",
									"Sophomore",
									"Junior",
									"Senior",
								]}
								onChange={(val: string) =>
									updateStudentAcademic({ standing: val })
								}
							/>

							<ProfileSelect
								label="Status"
								value={studentAcademic?.status}
								options={["Active", "Graduating", "Delayed"]}
								onChange={(val: string) =>
									updateStudentAcademic({ status: val })
								}
							/>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

function ProfileInput({ label, value, onChange, disabled = false }: any) {
	return (
		<div className="flex flex-col gap-1 w-full max-w-2xl">
			<label className="text-sm font-bold text-[#567375] ml-2 uppercase tracking-wide">
				{label}
			</label>
			<input
				type="text"
				disabled={disabled}
				value={value || ""}
				onChange={(e) => onChange && onChange(e.target.value)}
				className={`font-[family-name:var(--font-geist-mono)] w-full p-4 border-2 border-[#E3AF64] rounded-2xl bg-white text-[#1C2632] outline-none transition-focus focus:border-[#C9642A] ${
					disabled ? "opacity-60 cursor-not-allowed bg-gray-50" : ""
				}`}
			/>
		</div>
	);
}

function ProfileSelect({ label, value, options, onChange }: any) {
	return (
		<div className="flex flex-col gap-1 w-full max-w-2xl">
			<label className="text-sm font-bold text-[#567375] ml-2 uppercase tracking-wide font-[family-name:var(--font-geist-sans)]">
				{label}
			</label>
			<select
				value={value || ""}
				onChange={(e) => onChange(e.target.value)}
				className="w-full p-4 border-2 border-[#E3AF64] rounded-2xl bg-white text-[#1C2632] outline-none transition-focus focus:border-[#C9642A] font-[family-name:var(--font-geist-mono)] appearance-none cursor-pointer"
				style={{
					backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231C2632' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
					backgroundRepeat: "no-repeat",
					backgroundPosition: "right 1rem center",
					backgroundSize: "1.5em",
				}}
			>
				<option value="" disabled>
					Select {label}
				</option>
				{options.map((opt: string) => (
					<option key={opt} value={opt}>
						{opt}
					</option>
				))}
			</select>
		</div>
	);
}
