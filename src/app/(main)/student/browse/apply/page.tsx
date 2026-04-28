import { Suspense } from "react";
import StudentNavBar from "../../_components/StudentNavBar";
import { ApplyFormContent } from "./_components/ApplyFormContent";

export default function ApplyPage() {
	return (
		<div className="w-full min-h-screen bg-[#EDE9DE] flex flex-col">
			{/* Header */}
			<StudentNavBar path="Housing Browser > Apply" />

			{/* Application */}
			<Suspense
				fallback={
					<div className="w-full max-w-7xl mx-auto mt-4 md:mt-8 flex-1 bg-[#EDE9DE] p-6 md:p-10 rounded-t-[20px] shadow-inner">
						Loading...
					</div>
				}
			>
				<ApplyFormContent />
			</Suspense>
		</div>
	);
}
