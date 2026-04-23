"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDormDetails } from "../../_actions";
import { applicationData } from "@/data/application-data";

export function ApplyFormContent() {
	const dateNow = new Date(Date.now()).toISOString().split("T")[0];
	const router = useRouter();
	const searchParams = useSearchParams();
	const dormId = searchParams.get("id") ?? undefined;
	const [dormData, setDormData] = useState<any>(null);

	const room_types = ["Women Only", "Men Only", "Co-ed"] as const;
	type PreferredRoomType = (typeof room_types)[number];

	const [selectedRoomType, setSelectedRoomType] = useState<
		PreferredRoomType | ""
	>("");
	const [moveOutDate, setMoveOutDate] = useState("");
	const [fileName, setFileName] = useState<string>("");

	useEffect(() => {
		async function fetchData() {
			if (!dormId) return;

			try {
				const details = await getDormDetails(Number(dormId));
				setDormData(details);
			} catch (error) {
				console.error("Fetch error:", error);
			}
		}
		fetchData();
	}, [dormId]);

	const submitApplication = async () => {
		if (moveOutDate <= dateNow) {
			alert("Move-out date cannot be in the past");
			return;
		}
		if (selectedRoomType === "") {
			alert("Please select a room type");
			return;
		}
		if (fileName === "") {
			alert("Please upload a file");
			return;
		}
		const response = await applicationData.create({
			housing_name: dormData?.housing_name || "",
			preferred_room_type: selectedRoomType,
			application_status: "Pending Manager Approval",
			expected_moveout_date: moveOutDate,
			actual_moveout_date: null,
			room_id: null,
			manager_account_number: dormData?.manager_account_number || null,
			student_account_number: dormData?.student_account_number || null,
			landlord_account_number: dormData?.landlord_account_number || null,
			document_type: "Form 5/Proof of Enrollment",
			document_url: fileName,
			created_at: new Date().toISOString(),
			is_deleted: false,
		});
		if (response) {
			alert("Application submitted successfully");
		} else {
			alert("Application submission failed");
		}
	};

	const headerName = dormData?.housing_name || "Housing";

	return (
		<div className="mx-auto mt-8 w-[90vw] flex-1 bg-[#EDE9DE] p-10 rounded-t-[20px] font-[family-name:var(--font-geist-sans)]">
			{/* Back Button */}
			<button
				onClick={() => router.back()}
				className="mb-6 flex items-center text-[#1C2632] hover:opacity-70 transition-opacity"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="3"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="m15 18-6-6 6-6" />
				</svg>
			</button>

			<form
				className="space-y-6"
				onSubmit={(e) => {
					e.preventDefault();
					submitApplication();
				}}
			>
				{/* Header banner */}
				<div className="rounded-[10px] bg-[#1C2632] px-6 py-4 text-white">
					<h2 className="text-xl font-medium font-[family-name:var(--font-geist-sans)]">
						Application for {headerName}
					</h2>
				</div>

				{/* MAIN FORM GRID */}
				<div className="flex flex-col md:flex-row gap-10">
					{/* LEFT COLUMN */}
					<div className="w-full md:w-[350px] space-y-4 ">
						<div className="space-y-1.5">
							<label className="block text-sm font-bold text-[#1C2632] ">
								Preferred room type:
							</label>
							<div className="relative">
								<select
									value={selectedRoomType}
									onChange={(e) =>
										setSelectedRoomType(
											e.target.value as PreferredRoomType,
										)
									}
									className="w-full h-[45px] rounded-[10px] border border-[#CCCCCC] bg-[#D7D2C7] px-3 py-2 text-sm text-[#73716D] focus:outline-none focus:ring-2 focus:ring-[#C9642A] appearance-none"
								>
									<option value="" disabled hidden>
										| Select room type
									</option>

									{/* MAPPING THROUGH ROOM_TYPES */}
									{room_types.map((type) => (
										<option key={type} value={type}>
											{type}
										</option>
									))}
								</select>

								{/* Optional: Custom Arrow Icon */}
								<div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#73716D]">
									<svg
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
						</div>

						<div className="space-y-1.5">
							<label className="block text-sm font-bold text-[#1C2632]">
								Expected move-out date:
							</label>
							<input
								type="date"
								value={moveOutDate}
								onChange={(e) => setMoveOutDate(e.target.value)}
								className="w-full h-[45px] rounded-[10px] border border-[#CCCCCC] bg-[#D7D2C7] px-3 py-2 text-sm text-[#73716D] focus:outline-none focus:ring-2 focus:ring-[#C9642A]"
							/>
						</div>
					</div>

					{/* RIGHT COLUMN - File Upload */}
					<div className="flex-1 space-y-1.5">
						<label className="block text-sm font-bold text-[#1C2632]">
							Upload Form 5/ Proof of Enrollment
						</label>
						<div className="flex flex-col items-center justify-center h-[140px] rounded-[10px] border border-[#CCCCCC] bg-[#D7D2C7]/60 p-6 text-center">
							{fileName ? (
								<div className="flex flex-col items-center gap-2">
									{/* File Icon */}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-10 w-10 text-[#C9642A]"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									<span className="text-sm font-medium text-[#1C2632] truncate max-w-[200px]">
										{fileName}
									</span>
									<button
										onClick={() => setFileName("")}
										className="text-xs text-[#D66B38] hover:underline"
									>
										Remove
									</button>
								</div>
							) : (
								<label className="cursor-pointer rounded-full border border-[#1C2632] bg-[#D7D2C7] px-8 py-2 text-xs font-bold text-[#1C2632] hover:bg-[#c4beb1] transition-colors">
									Choose file
									<input
										type="file"
										className="sr-only"
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) setFileName(file.name);
										}}
									/>
								</label>
							)}
						</div>
					</div>
				</div>

				{/* Submit button */}
				<div className="flex justify-end pt-4">
					<button
						type="submit"
						className="rounded-[12px] bg-[#D66B38] px-12 py-3 text-sm font-bold text-white transition-transform hover:scale-105 active:scale-95 shadow-md"
					>
						Submit
					</button>
				</div>
			</form>
		</div>
	);
}
