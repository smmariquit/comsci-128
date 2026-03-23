"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;

    // Split name into first and last
    const [first_name, ...rest] = name.trim().split(" ");
    const last_name = rest.join(" ");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "temp",
        },
        body: JSON.stringify({
          account_email: email,
          first_name: first_name,
          last_name: last_name || "",
          user_type: "Student",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      // Success
      router.push("/student");

    } catch (err) {
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
            name="first name"
            type="text"
            placeholder="First Name"
            className="w-full rounded border px-3 py-2"
            required
          />
          <input
            name="first name"
            type="text"
            placeholder="Middle Name"
            className="w-full rounded border px-3 py-2"
            required
          />
          <input
            name="last name"
            type="text"
            placeholder="Last Name"
            className="w-full rounded border px-3 py-2"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full rounded border px-3 py-2"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
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