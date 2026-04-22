"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
	const router = useRouter();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	// required fields
	const [first_name, setFirstName] = useState("");
	const [last_name, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	// temporrary student number placeholder
	const student_number = 202306777;

	// optional fields
	const [middle_name, setMiddleName] = useState("");
	const [birthday, setBirthday] = useState("");
	const [home_address, setHomeAddress] = useState("");
	const [phone_number, setPhoneNumber] = useState("");
	const [contact_email, setContactEmail] = useState("");
	const [sex, setSex] = useState("");

	const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const response = await fetch("/api", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					account_email: email,
					first_name,
					middle_name: middle_name || null,
					last_name,
					password: password,
					birthday: birthday || null,
					home_address: home_address || null,
					phone_number: phone_number || null,
					contact_email: contact_email || null,
					sex: sex || "Prefer not to say",
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Registration failed.");
			}

			router.push("/student");
		} catch (_err) {
			setError("Something went wrong. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="w-full max-w-sm space-y-4">
				<h1 className="text-2xl font-bold">Register</h1>
				{error && <p className="text-sm text-red-500">{error}</p>}
				<form className="space-y-3" onSubmit={handleRegister}>
					<input
						type="text"
						placeholder="First Name"
						value={first_name}
						onChange={(e) => setFirstName(e.target.value)}
						className="w-full rounded border px-3 py-2"
						required
					/>
					<input
						type="text"
						placeholder="Middle Name (optional)"
						value={middle_name}
						onChange={(e) => setMiddleName(e.target.value)}
						className="w-full rounded border px-3 py-2"
					/>
					<input
						type="text"
						placeholder="Last Name"
						value={last_name}
						onChange={(e) => setLastName(e.target.value)}
						className="w-full rounded border px-3 py-2"
						required
					/>
					<input
						type="date"
						placeholder="Birthday (optional)"
						value={birthday}
						onChange={(e) => setBirthday(e.target.value)}
						className="w-full rounded border px-3 py-2"
					/>
					<input
						type="text"
						placeholder="Home Address (optional)"
						value={home_address}
						onChange={(e) => setHomeAddress(e.target.value)}
						className="w-full rounded border px-3 py-2"
					/>
					<input
						type="text"
						placeholder="Phone Number (optional)"
						value={phone_number}
						onChange={(e) => setPhoneNumber(e.target.value)}
						className="w-full rounded border px-3 py-2"
					/>
					<select
						value={sex}
						onChange={(e) => setSex(e.target.value)}
						className="w-full rounded border px-3 py-2"
					>
						<option value="">Select Sex (optional)</option>
						<option value="Male">Male</option>
						<option value="Female">Female</option>
						<option value="Prefer not to say">
							Prefer not to say
						</option>
					</select>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full rounded border px-3 py-2"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full rounded border px-3 py-2"
						required
					/>
					<button
						type="submit"
						disabled={loading}
						className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
					>
						{loading ? "Registering..." : "Register"}
					</button>
				</form>
			</div>
		</div>
	);
}
