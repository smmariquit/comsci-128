"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@/models/user";

export default function Page() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // from sample
        const userId = "17";
        const response = await fetch(`/api/users/${userId}`, {
          method: "GET",
        });

        const user: User = await response.json();
        setFirstName(user.first_name);
        setMiddleName(user.middle_name ?? "");
        setLastName(user.last_name);
        setEmail(user.account_email);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdate = async () => {
    try {
      const userId = "17";
      const updates = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        account_email: email, // Note: your service will filter this out
      };

      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        alert("Update Success! Check your Supabase dashboard.");
      } else {
        const errorData = await response.json();
        alert(`Update failed: ${errorData.message}`);
      }
    } catch (_err) {
      alert("Network error during update");
    }
  };

  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Profile Page</h1>
      {isLoading ? (
        <div className="flex flex-col gap-4 w-full max-w-md p-6 items-center">
          <div className="animate-pulse flex flex-col gap-4 w-full">
            <div className="h-4 bg-zinc-700 rounded w-1/2 mx-auto"></div>
            <div className="h-4 bg-zinc-700 rounded w-3/4 mx-auto mb-8"></div>
            <div className="h-10 bg-zinc-800 rounded border border-zinc-700"></div>
            <div className="h-10 bg-zinc-800 rounded border border-zinc-700"></div>
            <div className="h-10 bg-zinc-800 rounded border border-zinc-700"></div>
            <div className="h-10 bg-blue-600/50 rounded"></div>
          </div>
        </div>
      ) : (
        <>
          <div>
            {/* Only shows some field for demonstration purpose */}
            Name: {firstName} {middleName ? middleName : ""} {lastName}
            <br />
            Email: {email}
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md bg-zinc-900 p-6 rounded-lg border border-zinc-800 mb-8">
            <h2 className="text-xl font-semibold mb-2">Test Editor</h2>

            <input
              className="bg-zinc-800 p-2 rounded border border-zinc-700"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />

            <input
              className="bg-zinc-800 p-2 rounded border border-zinc-700"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="Middle Name"
            />

            <input
              className="bg-zinc-800 p-2 rounded border border-zinc-700"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />

            <button
              onClick={handleUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
            >
              Save Changes (PATCH)
            </button>
          </div>
        </>
      )}

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
