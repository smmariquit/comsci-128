"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Page() {
  const [roomDeleteId, setRoomDeleteId] = useState("");

	// Mock token to pass backend's authorization check
	const authHeader = { Authorization: "Bearer local-dev-token" };

  const handleDeleteRoom = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!confirm(`Are you sure you want to delete Room ${roomDeleteId}?`)) return;

      try {
          const res = await fetch(`/api/rooms/${roomDeleteId}`, {
              method: "DELETE",
              headers: authHeader, 
          });

          const result = await res.json();

          if (res.ok) {
              alert("Room deleted successfully!");
              setRoomDeleteId("");
          } else {
              // Displays your "Room must be Empty" or "Not Found" error
              alert(`Error: ${result.error}`);
          }
      } catch (err) {
          alert("System error. Check console.");
      }
  };

  return (
    <main className="min-h-screen  text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Rooms Page</h1>
      {/* ROOM DELETION SECTION */}
      <section
          style={{
              marginTop: "40px",
              border: "2px solid rgba(255, 0, 0, 1)",
              padding: "20px",
              borderRadius: "8px",
          }}
      >
          
          <form onSubmit={handleDeleteRoom} style={{ display: "flex", gap: "10px" }}>
              <input
                  placeholder="Enter Room ID"
                  value={roomDeleteId}
                  onChange={(e) => setRoomDeleteId(e.target.value)}
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
                  DELETE ROOM
              </button>
          </form>
      </section>
    </main>
  );
}