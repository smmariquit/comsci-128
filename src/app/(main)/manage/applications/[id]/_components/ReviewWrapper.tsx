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
  housingName,
  applicationStatus: initialStatus
}: {
  applicationId: number
  documents: Document[]
  fullName: string
  housingName: string | null
  applicationStatus: string
}) {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [currentStatus, setCurrentStatus] = useState(initialStatus)

  const selectedDoc = documents.find((d) => d.type === selectedType)

  const canAct = currentStatus === "Pending Manager Approval"
  const isApprovedOrRejected = ["Approved", "Rejected", "Cancelled"].includes(currentStatus)

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Pending Manager Approval":
        return "bg-yellow-200 text-yellow-800"
      case "Pending Admin Approval":
        return "bg-orange-200 text-orange-800"
      case "Approved":
        return "bg-green-200 text-green-800"
      case "Rejected":
        return "bg-red-200 text-red-800"
      case "Cancelled":
        return "bg-gray-200 text-gray-700"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const handleDecision = async (status: "Pending Admin Approval" | "Rejected") => {
    if (!canAct) return
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
      
      setCurrentStatus(status)
      setMessage(`Application processed successfully.`)
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-6 w-full">

      <div className="w-2/3 bg-yellow-50 rounded-xl shadow p-4 flex items-center justify-center text-black min-h-96">
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

        <div className="bg-yellow-50 rounded-xl shadow p-6 text-black space-y-2">
          <h2 className="font-semibold mb-2 text-xl">Applicant Info</h2>
          <p><strong>Name:</strong> {fullName}</p>
          <p><strong>Housing Applied for:</strong> {housingName ?? "N/A"}</p>
          <p><strong>Status:</strong> <span className={`px-2 py-0.5 rounded text-sm font-semibold inline-block ${getStatusStyles(currentStatus)}`}>{currentStatus}</span></p>
        </div>
        
        <div className="bg-yellow-50 rounded-xl shadow p-4 text-black">
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
            onClick={() => handleDecision("Pending Admin Approval")}
            disabled={loading || !canAct || isApprovedOrRejected}
            className={`px-4 py-2 rounded font-semibold disabled:opacity-50 ${
              canAct && !isApprovedOrRejected
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Approve
          </button>
          <button
            onClick={() => handleDecision("Rejected")}
            disabled={loading || !canAct || isApprovedOrRejected}
            className={`px-4 py-2 rounded font-semibold disabled:opacity-50 ${
              canAct && !isApprovedOrRejected
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Reject
          </button>
          {message && <p className="text-sm text-center text-gray-600">{message}</p>}
        </div>
      </div>
    </div>
  )
}