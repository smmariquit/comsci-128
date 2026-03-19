"use client";
import { User } from "@/app/lib/data/user";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Page() {
	const [firstName, setFirstName] = useState("");
	const [middleName, setMiddleName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		const fetchUser = async () => {
			try {
				// from sample
				const userId = "17";
				const response = await fetch(
					"http://localhost:3000/api/users",
					{
						method: "GET",
						headers: {
							account_number: userId,
						},
					},
				);

				const user: User = await response.json();
				setFirstName(user.first_name);
				setMiddleName(user.middle_name ?? "");
				setLastName(user.last_name);
				setEmail(user.account_email);
			} catch (error) {
				console.error("Error: ", error);
			}
		};

		fetchUser();
	}, []);

	return (
		<main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
			<h1 className="text-4xl font-bold text-center mb-8">
				Profile Page
			</h1>
			<div>
				{/* Only shows some field for demonstration purpose */}
				Name: {firstName} {middleName ? middleName : ""} {lastName}{" "}
				<br />
				Email: {email}
			</div>
			<div className="flex gap-4 flex-wrap justify-center">
				<Link
					href="/student"
					className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
				>
					Back to Dashboard
				</Link>
			</div>
		</main>
	);
}
