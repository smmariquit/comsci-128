import Link from "next/link";
import { findUserById } from "@/app/lib/data/user-data";

export default async function DashboardPage() {
	//placeholder data
	const curr_user = await findUserById(30);
	const notifs = [
		"OSH has approved your application",
		"Upload your payment receipt",
		"Successfully reserved at <dorm>",
	];
	const appli_steps = [
		"Dorm Selected",
		"Submitted Form",
		"Reviewed by OSH",
		"Reserved",
		"Submitted Receipt",
	];

	return (
		<div>
			<h1 className="text-4xl font-bold text-center mb-8">
				Student Dashboard Page
			</h1>
			<div className="flex gap-4 flex-wrap justify-center">
				<Link
					href="/student/housing"
					className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
				>
					Housing
				</Link>
				<Link
					href="/profile"
					className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
				>
					Profile
				</Link>
			</div>
			<h1 className="text-2xl font-bold">
				{curr_user?.first_name}'s Dashboard
			</h1>
			<div className="grid grid-cols-2 gap-4 mt-6 h-full">
				{/*APPLI STATUS, NOTIFS*/}
				<div className="flex flex-col gap-4 h-full">
					<div className="flex-1 p-6 bg-white rounded-2xl ">
						<h2 className="font-semibold text-black mb-3">
							Application Status
						</h2>
						<ul className="flex justify-between items-center w-full mb-3">
							{appli_steps.map((step, index) => (
								<li
									key={index}
									className="flex flex-col items-center text-center w-full"
								>
									{/*icons maybe*/}
									<div
										className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center text-white
                    ${index < 3 ? "bg-gray-600" : "bg-gray-400"}`}
									></div>
									{/*step label */}
									<span className="text-xs text-black">
										{step}
									</span>
								</li>
							))}
						</ul>
						<div className="flex-1 p-9 bg-gray-100 rounded-2xl"></div>
					</div>

					<div className="flex-1 p-6 bg-white rounded-2xl">
						<h2 className="font-semibold text-black mb-3">
							Notifications
						</h2>
						<ul className="flex flex-col gap-3">
							{notifs.map((item, index) => (
								<li
									key={index}
									className="bg-gray-100 p-2 rounded-lg text-black"
								>
									{item}
								</li>
							))}
						</ul>
					</div>
				</div>

				{/*HOUSING,BILLING*/}
				<div className="p-6 bg-white rounded-2xl h-full">
					<h2 className="font-semibold text-black mb-3 ">
						Active Housing Information
					</h2>
					<div className="flex-1 p-9 bg-gray-100 rounded-2xl mb-3"></div>
					<hr className="my-4 border-gray-300" />

					<h2 className="font-semibold text-black mb-3">
						Billing Information
					</h2>
					<div className="flex-1 p-9 bg-gray-100 rounded-2xl mb-3"></div>
					<button className="mt-auto w-full bg-gray-500 text-white py-1 rounded-lg hover:bg-gray-900 transition">
						View Billing Status
					</button>
				</div>
			</div>
		</div>
	);
}
