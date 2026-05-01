"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, SlidersHorizontal } from "lucide-react"
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
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filtered = useMemo(() => {
    let result = [...applications]
    
    const q = search.trim().toLowerCase()
    if (q) {
      result = result.filter((app) => {
        const user = app.student?.user
        const fullName = user
          ? `${user.first_name} ${user.middle_name || ""} ${user.last_name}`.toLowerCase()
          : ""
        return fullName.includes(q) || (app.housing_name?.toLowerCase().includes(q) ?? false)
      })
    }
    
    if (statusFilter !== "All Status") {
      result = result.filter((app) => app.application_status === statusFilter)
    }
    
    return result
  }, [applications, search, statusFilter])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or housing…"
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 pl-9 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none"
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 text-xs">▾</span>
        </div>
      </div>
      <p className="text-xs text-gray-600">
        {filtered.length === 0
          ? "No applications match your search."
          : `Showing ${filtered.length} application${filtered.length !== 1 ? "s" : ""}`}
      </p>

      <div className="bg-yellow-50 rounded-xl text-black shadow overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-800 text-[var(--dark-orange)]">
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
                const user = app.student?.user
                const fullName = user
                  ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
                  : "Unknown"

                return (
                  <tr key={app.application_id} className="border-t hover:bg-yellow-100">
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