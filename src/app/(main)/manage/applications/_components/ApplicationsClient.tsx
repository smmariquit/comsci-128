

"use client"

import { useState } from "react"
import Link from "next/link"
import { Constants, Database } from "@/app/types/database.types"

type Application = Database["public"]["Tables"]["application"]["Row"] & {
  student: {
    user: Database["public"]["Tables"]["user"]["Row"] | null
  } | null
}

const STATUSES = ["All Status", ...Constants.public.Enums.ApplicationStatus]

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

export default function ApplicationsClient({
  applications,
}: {
  applications: Application[]
}) {
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filtered = applications.filter((app) => {
    if (statusFilter !== "All Status" && app.application_status !== statusFilter) return false
    return true
  })

  return (
    <div className="flex flex-col gap-4">
      
      <div className="flex gap-4">
        <select
          className="p-2 border rounded bg-white text-black"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        {/* TODO: housing type filter*/}
        <select className="p-2 border rounded bg-white text-black opacity-50 cursor-not-allowed" disabled>
          <option>All Housing</option>
        </select>
      </div>

      <div className="bg-white rounded-xl text-black shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Housing</th>
              <th className="p-3">Expected Moveout Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-400">
                  No applications found.
                </td>
              </tr>
            ) : (
              filtered.map((app) => {
                const student = app.student as any
                const user = student?.user
                const fullName = user
                  ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
                  : "Unknown"

                return (
                  <tr key={app.application_id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{fullName}</td>
                    <td className="p-3">{app.housing_name ?? "N/A"}</td>
                    <td className="p-3">{app.expected_moveout_date ?? "N/A"}</td>
                    <td className="p-3">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${getStatusStyles(app.application_status)}`}>
                        {app.application_status}
                      </span>
                    </td>
                    <td className="p-3">
                      <Link href={`/manage/applications/${app.application_id}`}>
                        <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                          Review
                        </button>
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}