import { Suspense } from "react";
import StudentNavBar from "../../_components/StudentNavBar";
import { ApplyFormContent } from "./_components/ApplyFormContent";

export default function ApplyPage() {
	return (
		<div
			style={{
				width: "100%",
				minHeight: "100vh",
				background: "#1C2632",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Header */}
			<StudentNavBar path="Housing Browser > Apply" />

			{/* Application */}
			<Suspense
				fallback={
					<div className="mx-auto mt-8 w-[90vw] flex-1 bg-[#EDE9DE] p-10 rounded-t-[20px]">
						Loading...
					</div>
				}
			>
				<ApplyFormContent />
			</Suspense>
		</div>
	);
}
