import Link from "next/link";
import { applicationService } from "@/app/lib/services/application-service";

export default async function ApplicationsPage() {
  
  const applications = await applicationService.getApplications()

  return (
    <main className="min-h-screen flex flex-col p-6 gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-500">Applicant List</h1>
        <Link href="/manage" className="text-sm text-gray-500 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
                <th className="px-4 py-3">Applicant</th>
                <th className="px-4 py-3">Housing</th>
                <th className="px-4 py-3">Date Submitted</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => {
                const student = app.student as any
                const user = student?.user
                const fullName = user
                  ? `${user.first_name} ${user.middle_name ? user.middle_name + " " : ""}${user.last_name}`
                  : "Unknown"

                return (
                  <tr
                    key={app.application_id}
                    className="border-b border-gray-200 hover:bg-gray-500 bg-gray-100" 
                  >
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {app.housing_name ?? "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {app.expected_moveout_date ?? "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${app.application_status === "Approved" ? "bg-green-100 text-green-700" : ""}
                        ${app.application_status === "Pending" ? "bg-yellow-100 text-yellow-700" : ""}
                        ${app.application_status === "Rejected" ? "bg-red-100 text-red-700" : ""}
                        ${app.application_status === "Cancelled" ? "bg-gray-100 text-gray-700" : ""}
                      `}>
                        {app.application_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/manage/applications/${app.application_id}`}>
                        <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-xs font-semibold">
                          Review
                        </button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}