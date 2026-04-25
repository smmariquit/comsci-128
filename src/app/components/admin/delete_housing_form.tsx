/*
TODO: Instead of a form we can change this component to a delete button dynamic to each housing
*/

"use client";

import { useState } from "react";

export default function DeleteHousingForm() {
    const [housingDeleteId, setHousingDeleteId] = useState("");
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
                window.location.reload(); // Refresh to update the Server Component data
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (err) {
            alert("System error. Check console.");
        }
    };

    return (
        <section style={{
            marginTop: "40px", border: "2px solid rgba(255, 0, 0, 1)",
            padding: "20px", borderRadius: "8px", width: "100%", maxWidth: "450px"
        }}>
            <h2 style={{ fontSize: "1.2rem", color: "#ff0000", marginBottom: "15px", fontWeight: "bold" }}>
                Deactivate Housing
            </h2>
            <form onSubmit={handleDeleteHousing} style={{ display: "flex", gap: "10px" }}>
                <input
                    placeholder="Enter Housing ID"
                    value={housingDeleteId}
                    onChange={(e) => setHousingDeleteId(e.target.value)}
                    style={{ padding: "8px", color: "black", flex: 1, borderRadius: "4px" }}
                    required
                />
                <button
                    type="submit"
                    style={{
                        padding: "8px 20px", cursor: "pointer", backgroundColor: "#fff",
                        color: "#ff0000", border: "none", fontWeight: "bold",
                    }}
                >
                    DELETE HOUSING
                </button>
            </form>
        </section>
    );
}