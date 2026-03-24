"use client";

import { useState } from "react";
import Link from 'next/link';

export default function Page() {
  const [housingDeleteId, setHousingDeleteId] = useState("");

  // Mock token to pass backend's authorization check
  const authHeader = { Authorization: "Bearer local-dev-token" };

  const handleDeleteHousing = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!confirm(`Are you sure you want to deactivate Housing ID ${housingDeleteId}?`)) return;

      try {
          const res = await fetch(`/api/housing/${housingDeleteId}`, {
              method: "DELETE",
              headers: authHeader, 
          });

          const result = await res.json();

          if (res.ok) {
              alert("Housing record successfully deactivated!");
              setHousingDeleteId("");
          } else {
              // Displays custom "Not Found" or "Already Inactive" errors
              alert(`Error: ${result.error}`);
          }
      } catch (err) {
          alert("System error. Check console.");
      }
  };

  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Accommodations Page</h1>
      {/* HOUSING DELETION SECTION (Mirrors Room Delete Style) */}
      <section
        style={{
          marginTop: "40px",
          border: "2px solid rgba(255, 0, 0, 1)",
          padding: "20px",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "450px"
        }}
      >
          
      <form onSubmit={handleDeleteHousing} style={{ display: "flex", gap: "10px" }}>
        <input
          placeholder="Enter Housing ID"
          value={housingDeleteId}
          onChange={(e) => setHousingDeleteId(e.target.value)}
          style={{
            padding: "8px",
            color: "black",
            flex: 1,
            borderRadius: "4px"
          }}
          required
        />
          <button
            type="submit"
            style={{
              padding: "8px 20px",
              cursor: "pointer",
              backgroundColor: "#fff",
              color: "#ff0000",
              border: "none",
              fontWeight: "bold",
            }}
          >
            DELETE HOUSING
          </button>
        </form>
      </section>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link href="/admin" className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200">
          Back to Dashboard
        </Link>
      </div>
    </main>
  );
}