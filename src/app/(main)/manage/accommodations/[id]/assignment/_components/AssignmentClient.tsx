

"use client"

import { useState } from "react"
import Link from "next/link"

type Unit = {
  id: number
  name: string
  occupants: number
  freeSlots: number
  bedType: string
}

type Applicant = {
  application_id: number
  expected_moveout_date: string
  student_account_number: number | null
  student: any
}

function UnitCard({ unit, onClick }: { unit: Unit; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      className="cursor-pointer border rounded-xl p-6 bg-[var(--dark-blue)] flex flex-col gap-3 w-full min-h-[180px] hover:shadow-md transition"
    >
      <h3 className="text-lg font-semibold text-[var(--dark-orange)]">{unit.name}</h3>
      <div className="text-sm text-[var(--cream)] flex flex-col gap-2">
        <span>Occupants: {unit.occupants}</span>
        <span>Free Slots: {unit.freeSlots}</span>
        <span>Bed Type: {unit.bedType}</span>
      </div>
    </div>
  )
}

export default function AssignmentClient({
  units,
  applicants,
  housingId,
  setApplicants,
  setUnits
}: {
  units: Unit[]
  applicants: Applicant[]
  housingId: number
  setApplicants: (fn: (prev: Applicant[]) => Applicant[]) => void
  setUnits: (fn: (prev: Unit[]) => Unit[]) => void
}) {
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null)
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!selectedUnit || selectedApplicants.length === 0) return
    setLoading(true)
    setMessage(null)

    try {
     
      await Promise.all(
        selectedApplicants.map(async (applicationId) => {
          const applicant = applicants.find((a) => a.application_id === applicationId)
          if (!applicant) return

          console.log("fetching:", `/api/applications/${applicationId}/assign`) 
    console.log("applicant:", applicant)

          const res = await fetch(`/api/applications/${applicationId}/assign`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              roomId: selectedUnit,
              studentAccountNumber: applicant.student_account_number,
              moveoutDate: applicant.expected_moveout_date,
            }),
          })
      
          const result = await res.json()
          if (!res.ok) throw new Error(result.message)
        })
      )

      setApplicants(prev => prev.filter(app => !selectedApplicants.includes(app.application_id)))
      setUnits(prev => prev.map(unit => 
        unit.id === selectedUnit 
          ? { 
              ...unit, 
              occupants: unit.occupants + selectedApplicants.length,
              freeSlots: unit.freeSlots - selectedApplicants.length
            }
          : unit
      ))

      setMessage(`Successfully assigned ${selectedApplicants.length} applicant(s) to Unit #${selectedUnit}.`)
      setSelectedUnit(null)
      setSelectedApplicants([])

    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[var(--cream)] text-[var(--dark-blue)] flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl text-[var(--dark-orange)] font-semibold">
          Manage Accommodation Assignment
        </h1>
        <Link href={`/manage/accommodations/${housingId}`} className="text-sm text-gray-500 hover:underline">
          ← Back to Housing
        </Link>
      </div>

      {message && (
        <p className="text-sm text-center text-green-600 font-semibold">{message}</p>
      )}

      <div className="flex gap-6">

        <div className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-2 items-start text-sm">
            <h2 className="text-lg font-semibold">Unassigned Approved Tenants</h2>
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
                {applicants.length === 0 ? (
                  <tr> 
                    <td colSpan={2} className="p-3 text-gray-400">No unassigned applicants.</td>
                  </tr>
                ) : (
                  applicants.map((app) => {
                    const user = app.student?.user
                    const fullName = user
                      ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
                      : "Unknown"
                    return (
                      <tr key={app.application_id} className="border-t hover:bg-gray-50">
                        <td className="p-3">{fullName}</td>
                        <td className="p-3">{app.expected_moveout_date ?? "N/A"}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

   
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Room Assignment</h2>
          <div className="border rounded-lg p-4 max-h-[60vh] overflow-y-auto flex flex-col gap-3 w-full">
            {units.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                onClick={() => {
                  setSelectedUnit(unit.id)
                  setSelectedApplicants([])
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedUnit !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[400px] flex flex-col gap-4">
            <h2 className="text-lg font-semibold">
              Assign to Unit #{selectedUnit}
            </h2>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {applicants.length === 0 ? (
                <p className="text-gray-400 text-sm">No unassigned applicants.</p>
              ) : (
                applicants.map((app) => {
                  const user = app.student?.user
                  const fullName = user
                    ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
                    : "Unknown"
                  return (
                    <label key={app.application_id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedApplicants.includes(app.application_id)}
                        onChange={() => {
                          setSelectedApplicants((prev) =>
                            prev.includes(app.application_id)
                              ? prev.filter((id) => id !== app.application_id)
                              : [...prev, app.application_id]
                          )
                        }}
                      />
                      {fullName}
                    </label>
                  )
                })
              )}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setSelectedUnit(null)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || selectedApplicants.length === 0}
                className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {loading ? "Assigning..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}