

"use client"

import { useState } from "react"
import Link from "next/link"

type Application = {
  application_id: number
  housing_name: string | null
  application_status: string
  expected_moveout_date: string | null
  student: any
}

const STATUSES = ["All Status", "Pending", "Approved", "Rejected", "Cancelled"]

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
                      <span className={`px-2 py-1 rounded text-sm font-semibold
                        ${app.application_status === "Approved" ? "bg-green-200 text-green-800" : ""}
                        ${app.application_status === "Pending" ? "bg-yellow-200 text-yellow-800" : ""}
                        ${app.application_status === "Rejected" ? "bg-red-200 text-red-800" : ""}
                        ${app.application_status === "Cancelled" ? "bg-gray-200 text-gray-700" : ""}
                      `}>
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