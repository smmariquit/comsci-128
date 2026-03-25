"use client";
import { User } from "@/models/user";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Page() {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				// from sample
				const userId = "17";
				const response = await fetch("/api/users", {
					method: "GET",
				});

				const user: User[] = await response.json();
				setUsers(user);
			} catch (error) {
				console.error("Error: ", error);
			}
		};

		fetchUsers();
	}, []);

	return (
		<main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
			<h1 className="text-4xl font-bold text-center mb-8">
				Admin Users Page
			</h1>
			<div>
				<ul>
					{users.map((users) => (
						<li key={users.account_email}>
							{users.first_name} {users.middle_name ?? ""}{" "}
							{users.last_name} - {users.account_email}
						</li>
					))}
				</ul>
			</div>
			<div className="flex gap-4 flex-wrap justify-center">
				<Link
					href="/admin"
					className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
				>
					Back to Dashboard
				</Link>
			</div>
		</main>
	);
}
