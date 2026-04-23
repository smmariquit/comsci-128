// Temporary component for testing housing image upload

"use client";

import { useState } from "react";
import { C } from "@/lib/palette";

export default function HousingImageUpload() {
	const [housingIdInput, setHousingIdInput] = useState("");

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);

	const getSafePreviewUrl = (url: string | null): string => {
		if (!url) return "";
		return url.startsWith("blob:") ? url : "";
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			setPreviewUrl(URL.createObjectURL(file));
		}
	};

	const handleRemove = () => {
		setSelectedFile(null);
		setPreviewUrl(null);
	};

	const handleUpload = async () => {
		if (!selectedFile) return;

		const numericId = parseInt(housingIdInput, 10);
		if (!housingIdInput || isNaN(numericId)) {
			alert("Please enter a valid numeric Housing ID.");
			return;
		}

		try {
			setIsUploading(true);

			const formData = new FormData();
			formData.append("image", selectedFile);

			const response = await fetch(`/api/housing/${numericId}/image`, {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				const payload = await response.json().catch(() => null);
				throw new Error(payload?.error ?? "Upload request failed.");
			}

			alert(`Success! Image uploaded for Housing ID: ${numericId}`);

			setSelectedFile(null);
			setPreviewUrl(null);
			setHousingIdInput("");
		} catch (error) {
			console.error("Upload failed:", error);
			alert("Failed to upload image. Please check the console.");
		} finally {
			setIsUploading(false);
		}
	};

	return (
		<div
			style={{
				background: "#fff",
				borderRadius: 16,
				width: 500,
				maxWidth: "100%",
				outline: `1px solid ${C.cream}`,
				fontFamily: "'DM Sans', sans-serif",
				overflow: "hidden",
			}}
		>
			<div
				style={{
					padding: "20px 24px 16px",
					borderBottom: `1px solid ${C.dividerLight}`,
				}}
			>
				<div style={{ fontSize: 16, fontWeight: 700, color: C.navy }}>
					Test Image Upload
				</div>
			</div>

			<div
				style={{
					padding: "20px 24px",
					display: "flex",
					flexDirection: "column",
					gap: 18,
				}}
			>
				{/* ID Input */}
				<div>
					<label
						style={{
							display: "block",
							fontSize: 10.5,
							fontFamily: "'DM Mono', monospace",
							fontWeight: 500,
							color: C.teal,
							textTransform: "uppercase",
							letterSpacing: 0.8,
							marginBottom: 8,
						}}
					>
						Target Housing ID
					</label>
					<input
						type="number"
						placeholder="e.g. 12"
						value={housingIdInput}
						onChange={(e) => setHousingIdInput(e.target.value)}
						style={{
							width: "100%",
							boxSizing: "border-box",
							padding: "10px 14px",
							borderRadius: 8,
							border: `1px solid ${C.cream}`,
							fontSize: 13,
							fontFamily: "'DM Sans', sans-serif",
							color: C.navy,
							outline: "none",
						}}
					/>
				</div>

				{/* Upload Area */}
				<div>
					<label
						style={{
							display: "block",
							fontSize: 10.5,
							fontFamily: "'DM Mono', monospace",
							fontWeight: 500,
							color: C.teal,
							textTransform: "uppercase",
							letterSpacing: 0.8,
							marginBottom: 8,
						}}
					>
						Image File
					</label>

					<div
						style={{
							minHeight: 160,
							borderRadius: 12,
							border: `1px dashed ${C.teal}`,
							background: "rgba(86,115,117,0.03)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							padding: 16,
							textAlign: "center",
						}}
					>
						{previewUrl ? (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									width: "100%",
								}}
							>
								<img
									src={getSafePreviewUrl(previewUrl)}
									alt="Preview"
									style={{
										width: "100%",
										height: 130,
										objectFit: "cover",
										borderRadius: 8,
										border: `1px solid ${C.dividerLight}`,
										marginBottom: 12,
									}}
								/>
								{selectedFile && (
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: 12,
										}}
									>
										<span
											style={{
												fontSize: 12,
												color: C.navy,
												fontWeight: 500,
											}}
										>
											{selectedFile.name.length > 25
												? selectedFile.name.substring(
														0,
														25,
													) + "..."
												: selectedFile.name}
										</span>
										<button
											onClick={handleRemove}
											disabled={isUploading}
											style={{
												background: "transparent",
												border: "none",
												color: C.orange,
												fontSize: 12,
												fontWeight: 700,
												cursor: isUploading
													? "not-allowed"
													: "pointer",
												fontFamily:
													"'DM Sans', sans-serif",
												padding: 0,
											}}
										>
											Remove
										</button>
									</div>
								)}
							</div>
						) : (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									gap: 12,
								}}
							>
								{/* Decorative Icon */}
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke={C.teal}
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<rect
										x="3"
										y="3"
										width="18"
										height="18"
										rx="2"
										ry="2"
									/>
									<circle cx="8.5" cy="8.5" r="1.5" />
									<polyline points="21 15 16 10 5 21" />
								</svg>

								<label
									style={{
										fontFamily: "'DM Sans', sans-serif",
										fontSize: 13,
										fontWeight: 500,
										padding: "7px 16px",
										borderRadius: 8,
										border: `1px solid ${C.cream}`,
										background: "#fff",
										color: C.navy,
										cursor: "pointer",
									}}
								>
									Choose Image
									<input
										type="file"
										accept="image/png, image/jpeg, image/webp"
										style={{ display: "none" }}
										onChange={handleFileChange}
									/>
								</label>
							</div>
						)}
					</div>
				</div>
			</div>

			<div
				style={{
					padding: "16px 24px",
					borderTop: `1px solid ${C.dividerLight}`,
					display: "flex",
					justifyContent: "flex-end",
				}}
			>
				<button
					onClick={handleUpload}
					disabled={isUploading || !selectedFile}
					style={{
						fontFamily: "'DM Sans', sans-serif",
						fontSize: 13,
						fontWeight: 600,
						padding: "9px 20px",
						borderRadius: 9,
						border: "none",
						background:
							isUploading || !selectedFile ? C.cream : C.orange,
						color: isUploading || !selectedFile ? C.teal : "#fff",
						cursor:
							isUploading || !selectedFile
								? "not-allowed"
								: "pointer",
						transition: "0.2s",
					}}
				>
					{isUploading ? "Uploading..." : "Save to Database"}
				</button>
			</div>
		</div>
	);
}
