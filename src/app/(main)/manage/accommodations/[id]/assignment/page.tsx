"use client";

import Link from "next/link";
import { useState } from "react";

function UnitCard({
  id,
  name,
  occupants,
  freeSlots,
  bedType,
  onClick,
}: {
  id: number;
  name: string;
  occupants: number;
  freeSlots: number;
  bedType: string;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-xl p-6 bg-[var(--dark-blue)] flex flex-col gap-3 w-full min-h-[180px] hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-[var(--dark-orange)]">{name}</h3>

      <div className="text-sm text-[var(--cream)] flex flex-col gap-2">
        <span>Occupants: {occupants}</span>
        <span>Free Slots: {freeSlots}</span>
        <span>Bed Type: {bedType}</span>
      </div>
    </div>
  );
}

export default function RoomAssignmentPage() {

  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([]);

  const units = [
    { id: 1, name: "Unit A", occupants: 2, freeSlots: 2, bedType: "Double" },
    { id: 2, name: "Unit B", occupants: 4, freeSlots: 0, bedType: "Single" },
    { id: 3, name: "Unit C", occupants: 1, freeSlots: 1, bedType: "Shared" },
  ];

  const applicants = [
    { id: 1, name: "Wei Wuxian", date: "2026-03-01" },
    { id: 2, name: "Lan Wangji", date: "2026-03-02" },
    { id: 3, name: "Lan Xichen", date: "2026-03-03" },
  ];

  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--dark-blue)] flex flex-col gap-6 p-6">

      <div className="mb-2">
        <h1 className="text-2xl text-[var(--dark-orange)] font-semibold">
          Manage Accommodation Assignment
        </h1>
      </div>

      <div className="flex gap-6">

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2 items-start text-sm">
            <h1 className="text-lg font-semibold">
              Unassigned Approved Tenants
            </h1>

            <div className="bg-gray-200 h-8 rounded flex items-center px-3 text-xs text-gray-600 w-full">
              Filter (to be implemented)
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden bg-yellow-100">
            <table className="w-full text-sm table-auto">
              <thead className="bg-[var(--dark-blue)] text-[var(--dark-orange)]">
                <tr>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Date Applied</th>
                </tr>
              </thead>

              <tbody>
                {applicants.map((app) => (
                  <tr
                    key={app.id}
                    className="border-t hover:bg-gray-50 align-top"
                  >
                    <td className="p-3 whitespace-normal break-words max-w-[300px]">
                      {app.name}
                    </td>

                    <td className="p-3 whitespace-nowrap">
                      {app.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>



        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            Room Assignment
          </h2>

          <div className="border rounded-lg p-4 max-h-[60vh] overflow-y-auto flex flex-col gap-3 w-full">
            {units.map((unit) => (
              <UnitCard
                key={unit.id}
                {...unit}
                onClick={() => {
                  setSelectedUnit(unit.id);
                  setSelectedApplicants([]); // reset selection
                }}
              />
            ))}
          </div>
        </div>

      </div>


      {/* Pop up */}
      {selectedUnit !== null && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[400px] flex flex-col gap-4">

          <h2 className="text-lg font-semibold">
            Select who to assign
          </h2>

          <div className="flex flex-col gap-2">
            {applicants.map((app) => (
              <label key={app.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedApplicants.includes(app.id)}
                  onChange={() => {
                    setSelectedApplicants((prev) =>
                      prev.includes(app.id)
                        ? prev.filter((id) => id !== app.id)
                        : [...prev, app.id]
                    );
                  }}
                />
                {app.name}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setSelectedUnit(null)}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                console.log("Assign:", selectedApplicants, "to unit:", selectedUnit);
                setSelectedUnit(null);
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Confirm
            </button>
          </div>

        </div>
      </div>
      )}

    </main>
  );
}