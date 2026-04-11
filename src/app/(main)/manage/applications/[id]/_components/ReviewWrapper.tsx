

"use client"

import { useState } from "react"

type Document = {
  document_id: number
  type: string
  storage_link: string | null
}

const DOC_TYPES = ["Form 5", "Payment Receipt", "Contract", "Waiver"]

export default function ReviewWrapper({
  applicationId,
  documents,
  fullName,
  housingName
}: {
  applicationId: number
  documents: Document[]
  fullName: string
  housingName: string | null
}) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const selectedDoc = documents.find((d) => d.type === selectedType)

  const handleDecision = async (status: "Approved" | "Rejected") => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ application_status: status }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.message)
      setMessage(`Application ${status} successfully.`)
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-6 w-full">

      <div className="w-2/3 bg-white rounded-xl shadow p-4 flex items-center justify-center text-black min-h-96">
        {!selectedType ? (
          <p className="text-gray-400 text-sm">Select a document to preview</p>
        ) : !selectedDoc?.storage_link ? (
          <p className="text-gray-400 text-sm">No file uploaded for this document.</p>
        ) : (
          <iframe
            src={selectedDoc.storage_link}
            className="w-full h-[600px] rounded-xl"
            title={selectedType}
          />
        )}
      </div>

      <div className="w-1/3 flex flex-col gap-4">


        {/* Applicant Info */}
        <div className="bg-white rounded-xl shadow p-4 text-black">
          <h2 className="font-semibold mb-2">Applicant Info</h2>
          <p><strong>Name:</strong> {fullName}</p>
          <p><strong>Housing Applied for:</strong> {housingName ?? "N/A"}</p>
        </div>
        
        {/* Submitted Files */}
        <div className="bg-white rounded-xl shadow p-4 text-black">
          <h2 className="font-semibold mb-3">Submitted Files</h2>
          <div className="flex flex-col gap-2">
            {DOC_TYPES.map((type) => {
              const exists = documents.some((d) => d.type === type)
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  disabled={!exists}
                  className={`px-4 py-2 rounded text-sm font-semibold text-left transition
                    ${selectedType === type ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}
                    ${!exists ? "opacity-40 cursor-not-allowed" : ""}
                  `}
                >
                  {type}
                  {!exists && <span className="text-xs ml-2">(missing)</span>}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleDecision("Approved")}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => handleDecision("Rejected")}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 disabled:opacity-50"
          >
            Reject
          </button>
          {message && <p className="text-sm text-center text-gray-600">{message}</p>}
        </div>
      </div>
    </div>
  )
}