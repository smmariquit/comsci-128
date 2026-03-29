"use client";

import { useState } from "react";
import Link from 'next/link';
import DormCard from "@/app/components/admin/dorm_card";

// Mock card data used as an example until API integration is wired.
// Replace this with fetched data from /api/housing, then map the response.
const mockDormCards = [
  {
    housingId: "H-001",
    name: "Batong Malake Subdivision",
    address: "UPLB College, Batong Malake, Los Banos",
    totalRooms: 36,
    occupiedRooms: 31,
    vacantRooms: 5,
    occupancyRate: 86,
    minRent: 3500,
  },
  {
    housingId: "H-002",
    name: "Raymundo Residence Hall",
    address: "Raymundo Gate, Los Banos",
    totalRooms: 24,
    occupiedRooms: 16,
    vacantRooms: 8,
    occupancyRate: 67,
    minRent: 4200,
  },
  {
    housingId: "H-003",
    name: "Anos Garden Dormitory",
    address: "Anos, Los Banos, Laguna",
    totalRooms: 18,
    occupiedRooms: 18,
    vacantRooms: 0,
    occupancyRate: 100,
    minRent: 4800,
  },
];

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
    <main className="min-h-screen text-white flex flex-col items-center p-6">
     
      
      {/* DORM CARDS SECTION */}
      <section className="w-full mb-12">
        <h2 className="text-2xl font-bold mb-6">Housing Units</h2>

        {/*
          HOW TO USE DormCard HERE:
          1) Keep mockDormCards while backend is not yet connected.
          2) When API is ready, fetch from /api/housing and set state.
          3) Map each housing item to <DormCard {...item} />.
          4) Pass onManage to route to detail/manage page using housingId.
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          {mockDormCards.map((housing) => (
            <DormCard
              key={housing.housingId}
              {...housing}
              onManage={() => alert(`Manage ${housing.name} (${housing.housingId})`)}
            />
          ))}
        </div>
      </section>

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
    </main>
  );
}