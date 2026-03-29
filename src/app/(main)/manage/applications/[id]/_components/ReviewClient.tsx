

"use client"

import { useState } from "react"

type Document = {
  document_id: number
  type: string
  storage_link: string | null
}

const DOC_TYPES = ["Form 5", "Payment Receipt", "Contract", "Waiver"]

export default function ReviewClient({
  applicationId,
  documents,
}: {
  applicationId: number
  documents: Document[]
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
    <div className="flex flex-col gap-6">

      <div className="flex gap-4">

        <div className="flex flex-col gap-2 w-48 shrink-0">
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
                {!exists && <span className="text-xs ml-1">(missing)</span>}
              </button>
            )
          })}
        </div>


        <div className="flex-1 bg-gray-100 rounded-xl min-h-96 flex items-center justify-center">
          {!selectedType ? (
            <p className="text-gray-400 text-sm">Select a document to preview</p>
          ) : !selectedDoc?.storage_link ? (
            <p className="text-gray-400 text-sm">No file uploaded for this document.</p>
          ) : (
            <iframe
              src={selectedDoc.storage_link}
              className="w-full h-96 rounded-xl"
              title={selectedType}
            />
          )}
        </div>
      </div>


      <div className="flex gap-4 items-center">
        <button
          onClick={() => handleDecision("Approved")}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
        >
          Approve
        </button>
        <button
          onClick={() => handleDecision("Rejected")}
          disabled={loading}
          className="bg-red-600 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 disabled:opacity-50"
        >
          Reject
        </button>
        {message && (
          <p className="text-sm text-gray-600">{message}</p>
        )}
      </div>
    </div>
  )
}